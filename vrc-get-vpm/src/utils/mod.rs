mod copy_recursive;
mod crlf_json_formatter;
mod deup_deserializer;
mod extract_zip;
mod save_controller;
mod sha256_async_write;

use crate::io;
use crate::io::{DirEntry, IoTrait};
use async_zip::error::ZipError;
use either::Either;
use futures::prelude::*;
use futures::stream::FuturesUnordered;
use pin_project_lite::pin_project;
use serde_json::error::Category;
use serde_json::{Map, Value};
use std::path::{Component, Path, PathBuf};
use std::pin::Pin;
use std::task::{ready, Context, Poll};

pub(crate) use copy_recursive::copy_recursive;
pub(crate) use crlf_json_formatter::to_vec_pretty_os_eol;
pub(crate) use deup_deserializer::DedupForwarder;
pub(crate) use extract_zip::extract_zip;
pub(crate) use save_controller::SaveController;
pub(crate) use sha256_async_write::Sha256AsyncWrite;

pub(crate) trait PathBufExt {
    fn joined(self, into: impl AsRef<Path>) -> Self;
}

impl PathBufExt for PathBuf {
    fn joined(mut self, into: impl AsRef<Path>) -> Self {
        self.push(into);
        self
    }
}

pub(crate) trait MapResultExt<T> {
    type Output;
    /// returns
    fn err_mapped(self) -> Result<T, Self::Output>;
}

impl<T> MapResultExt<T> for Result<T, reqwest::Error> {
    type Output = io::Error;

    fn err_mapped(self) -> Result<T, Self::Output> {
        self.map_err(|err| io::Error::new(io::ErrorKind::NotFound, err))
    }
}

impl<T> MapResultExt<T> for Result<T, ZipError> {
    type Output = io::Error;

    fn err_mapped(self) -> Result<T, Self::Output> {
        self.map_err(|err| {
            use io::ErrorKind::*;
            let kind = match err {
                ZipError::FeatureNotSupported(_) => Unsupported,
                ZipError::CompressionNotSupported(_) => Unsupported,
                ZipError::AttributeCompatibilityNotSupported(_) => Unsupported,
                ZipError::TargetZip64NotSupported => Unsupported,
                ZipError::EOFNotReached => InvalidData,
                ZipError::UnableToLocateEOCDR => InvalidData, // better kind?
                ZipError::InvalidExtraFieldHeader(_, _) => InvalidData,
                ZipError::Zip64ExtendedFieldIncomplete => InvalidData,
                ZipError::UpstreamReadError(ref upstream) => upstream.kind(),
                ZipError::CRC32CheckError => InvalidData,
                ZipError::EntryIndexOutOfBounds => InvalidData,
                ZipError::UnexpectedHeaderError(_, _) => InvalidData,
                // fallback to InvalidData but data
                _ => InvalidData,
            };

            io::Error::new(kind, err)
        })
    }
}

pub(crate) trait JsonMapExt {
    fn get_or_put_mut<Q, V>(&mut self, key: Q, value: impl FnOnce() -> V) -> &mut Value
    where
        Q: Into<String>,
        V: Into<Value>;
}

impl JsonMapExt for Map<String, Value> {
    fn get_or_put_mut<Q, V>(&mut self, key: Q, value: impl FnOnce() -> V) -> &mut Value
    where
        Q: Into<String>,
        V: Into<Value>,
    {
        self.entry(key.into()).or_insert_with(|| value().into())
    }
}

pub(crate) trait OurTryStreamExt: Stream + Sized {
    fn flatten_ok(self) -> FlattenOk<Self>
    where
        Self: TryStream,
        Self::Ok: Stream,
    {
        FlattenOk {
            stream: self,
            next: None,
        }
    }
}

impl<T: Stream + Sized> OurTryStreamExt for T {}

pin_project! {
    #[must_use = "iterator adaptors are lazy and do nothing unless consumed"]
    pub(crate) struct FlattenOk<S> where S: TryStream{
        #[pin]
        stream: S,
        #[pin]
        next: Option<S::Ok>,
    }
}

impl<S> Stream for FlattenOk<S>
where
    S: TryStream,
    S::Ok: Stream,
{
    type Item = Result<<S::Ok as Stream>::Item, S::Error>;

    fn poll_next(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        let mut this = self.project();

        Poll::Ready(loop {
            if let Some(s) = this.next.as_mut().as_pin_mut() {
                if let Some(item) = ready!(s.poll_next(cx)) {
                    break Some(Ok(item));
                } else {
                    this.next.set(None);
                }
            } else if let Some(s) = ready!(this.stream.as_mut().try_poll_next(cx)?) {
                this.next.set(Some(s));
            } else {
                break None;
            }
        })
    }
}

pub(crate) fn walk_dir_relative<IO: IoTrait>(
    io: &IO,
    paths: impl IntoIterator<Item = PathBuf>,
) -> impl Stream<Item = (PathBuf, IO::DirEntry)> + '_ {
    type FutureResult<IO> = Either<
        io::Result<(<IO as IoTrait>::ReadDirStream, PathBuf)>,
        io::Result<
            Option<(
                <IO as IoTrait>::ReadDirStream,
                PathBuf,
                <IO as IoTrait>::DirEntry,
            )>,
        >,
    >;

    async fn read_dir_phase<IO: IoTrait>(
        io: &IO,
        relative: PathBuf,
    ) -> io::Result<(IO::ReadDirStream, PathBuf)> {
        log::trace!("s:read_dir_phase: {:?}", relative);
        match io.read_dir(&relative).await {
            Ok(result) => {
                log::trace!("e:read_dir_phase: {:?}", relative);
                Ok((result, relative))
            }
            Err(e) => {
                log::trace!("e:read_dir_phase: {:?}: {e:?}", relative);
                Err(e)
            }
        }
    }

    async fn next_phase<IO: IoTrait>(
        mut read_dir: IO::ReadDirStream,
        relative: PathBuf,
    ) -> io::Result<Option<(IO::ReadDirStream, PathBuf, IO::DirEntry)>> {
        log::trace!("s:next_phase: {:?}", relative);
        if let Some(entry) = read_dir.try_next().await? {
            log::trace!("e:next_phase: {:?}: {:?}", relative, entry.file_name());
            Ok(Some((read_dir, relative, entry)))
        } else {
            log::trace!("e:next_phase: {:?}", relative);
            Ok(None)
        }
    }

    let mut futures = FuturesUnordered::new();

    for path in paths {
        futures.push(Either::Left(
            read_dir_phase(io, path).map(FutureResult::<IO>::Left),
        ));
    }

    async_stream::stream! {
        loop {
            match futures.next().await {
                None => break,
                Some(Either::Left(Err(_))) => continue,
                Some(Either::Left(Ok((read_dir, dir_relative)))) => {
                    futures.push(Either::Right(next_phase::<IO>(read_dir, dir_relative).map(FutureResult::<IO>::Right)))
                },
                Some(Either::Right(Err(_))) => continue,
                Some(Either::Right(Ok(None))) => continue,
                Some(Either::Right(Ok(Some((read_dir_iter, dir_relative, entry))))) => {
                    let entry: IO::DirEntry = entry;
                    let new_relative_path = dir_relative.join(entry.file_name());
                    match entry.file_type().now_or_never() {
                        Some(Ok(file_type)) if !file_type.is_dir() => {
                            // the entry is known to be a file
                        },
                        _ => {
                            futures.push(Either::Left(read_dir_phase(io, new_relative_path.clone()).map(FutureResult::<IO>::Left)));
                        },
                    }
                    futures.push(Either::Right(next_phase(read_dir_iter, dir_relative).map(FutureResult::<IO>::Right)));
                    log::trace!("yield: {:?}", new_relative_path);
                    yield (new_relative_path, entry);
                },
            }
        }
    }
}

pub(crate) fn deserialize_json<T: serde::de::DeserializeOwned>(value: Value) -> io::Result<T> {
    serde_path_to_error::deserialize(&value).map_err(to_io_err)
}

pub(crate) fn deserialize_json_slice<T: serde::de::DeserializeOwned>(
    slice: &[u8],
) -> io::Result<T> {
    let mut deserializer = serde_json::Deserializer::from_slice(slice);
    serde_path_to_error::deserialize(&mut deserializer).map_err(to_io_err)
}

pub(crate) fn to_io_err(err: serde_path_to_error::Error<serde_json::Error>) -> io::Error {
    match err.inner().classify() {
        Category::Io => err.into_inner().into(),
        Category::Syntax | Category::Data => io::Error::new(io::ErrorKind::InvalidData, err),
        Category::Eof => io::Error::new(io::ErrorKind::UnexpectedEof, err),
    }
}

pub(crate) async fn read_json_file<T: serde::de::DeserializeOwned>(
    mut file: impl AsyncRead + Unpin,
    path: &Path,
) -> io::Result<T> {
    let mut vec = Vec::new();
    file.read_to_end(&mut vec).await?;

    let mut slice = vec.as_slice();
    slice = slice.strip_prefix(b"\xEF\xBB\xBF").unwrap_or(slice);

    let mut deserializer = serde_json::Deserializer::from_slice(slice);
    match serde_path_to_error::deserialize(&mut deserializer) {
        Ok(loaded) => Ok(loaded),
        Err(e) => Err(io::Error::new(
            io::ErrorKind::InvalidData,
            format!("syntax error loading {}: {}", path.display(), e),
        )),
    }
}

pub(crate) async fn try_load_json<T: serde::de::DeserializeOwned>(
    io: &impl IoTrait,
    path: &Path,
) -> io::Result<Option<T>> {
    match io.open(path).await {
        Ok(file) => Ok(Some(read_json_file::<T>(file, path).await?)),
        Err(ref e) if e.kind() == io::ErrorKind::NotFound => Ok(None),
        Err(e) => Err(e),
    }
}

pub(crate) async fn load_json_or_default<T>(io: &impl IoTrait, path: &Path) -> io::Result<T>
where
    T: serde::de::DeserializeOwned + Default,
{
    match io.open(path).await {
        Ok(file) => Ok(read_json_file::<T>(file, path).await?),
        Err(ref e) if e.kind() == io::ErrorKind::NotFound => Ok(Default::default()),
        Err(e) => Err(e),
    }
}

pub(crate) fn normalize_path(input: &Path) -> PathBuf {
    let mut result = PathBuf::with_capacity(input.as_os_str().len());

    for component in input.components() {
        match component {
            Component::Prefix(prefix) => result.push(prefix.as_os_str()),
            Component::RootDir => result.push(component.as_os_str()),
            Component::CurDir => {}
            Component::ParentDir => {
                result.pop();
            }
            Component::Normal(_) => result.push(component.as_os_str()),
        }
    }

    result
}

pub(crate) fn check_absolute_path(path: impl AsRef<Path>) -> io::Result<()> {
    if !path.as_ref().is_absolute() {
        return Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            "project path must be absolute",
        ));
    }
    Ok(())
}
