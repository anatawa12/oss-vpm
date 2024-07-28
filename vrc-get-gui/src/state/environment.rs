use log::info;
use std::io;
use std::num::Wrapping;
use tauri::{App, Manager};
use tokio::sync::Mutex;
use vrc_get_vpm::environment::{PackageCollection, UserProject};
use vrc_get_vpm::io::DefaultEnvironmentIo;
use vrc_get_vpm::unity_project::PendingProjectChanges;
use vrc_get_vpm::{Environment, PackageInfo};
use yoke::{Yoke, Yokeable};

async fn new_environment(io: &DefaultEnvironmentIo) -> io::Result<Environment> {
    Environment::load(io).await
}

pub fn new_env_state(app: &App) -> impl Send + Sync + 'static {
    Mutex::new(EnvironmentState::new(
        app.state::<DefaultEnvironmentIo>().inner().clone(),
        app.state::<reqwest::Client>().inner().clone(),
    ))
}

unsafe impl Send for EnvironmentState {}

unsafe impl Sync for EnvironmentState {}

#[derive(Yokeable)]
pub struct PackageList<'env> {
    pub packages: Vec<PackageInfo<'env>>,
}

impl<'a> FromIterator<PackageInfo<'a>> for PackageList<'a> {
    fn from_iter<T: IntoIterator<Item = PackageInfo<'a>>>(iter: T) -> Self {
        Self {
            packages: iter.into_iter().collect(),
        }
    }
}

pub struct EnvironmentState {
    pub io: DefaultEnvironmentIo,
    pub http: reqwest::Client,
    pub environment: EnvironmentHolder,
    pub packages: Option<Yoke<PackageList<'static>, Box<PackageCollection>>>,
    // null or reference to
    pub projects: Box<[UserProject]>,
    pub projects_version: Wrapping<u32>,
    pub changes_info: crate::commands::ChangesInfoHolder,
}

pub struct PendingProjectChangesInfo<'env> {
    pub environment_version: u32,
    pub changes_version: u32,
    pub changes: PendingProjectChanges<'env>,
}

pub struct EnvironmentHolder {
    pub environment: Option<Environment>,
    pub last_update: Option<tokio::time::Instant>,
    pub environment_version: Wrapping<u32>,
    pub last_repository_update: Option<tokio::time::Instant>,
}

impl EnvironmentHolder {
    pub fn new() -> Self {
        Self {
            environment: None,
            last_update: None,
            environment_version: Wrapping(0),
            last_repository_update: None,
        }
    }

    pub async fn get_environment_mut(
        &mut self,
        update_repository: UpdateRepositoryMode,
        io: &DefaultEnvironmentIo,
        http: &reqwest::Client,
    ) -> io::Result<&mut Environment> {
        if let Some(ref mut environment) = self.environment {
            if !self
                .last_update
                .map(|x| x.elapsed() < tokio::time::Duration::from_secs(1))
                .unwrap_or(false)
            {
                info!("reloading settings files");
                // reload settings files
                environment.reload(io).await?;
                self.last_update = Some(tokio::time::Instant::now());
            }

            // outdated after 5 min
            const OUTDATED: tokio::time::Duration = tokio::time::Duration::from_secs(60 * 5);

            match update_repository {
                UpdateRepositoryMode::None => {}
                UpdateRepositoryMode::Force => {
                    self.last_repository_update = Some(tokio::time::Instant::now());
                    self.environment_version += Wrapping(1);
                    info!("loading package infos");
                    environment.load_package_infos(io, Some(http)).await?;
                }
                UpdateRepositoryMode::IfOutdatedOrNecessary => {
                    if self
                        .last_repository_update
                        .map(|x| x.elapsed() > OUTDATED)
                        .unwrap_or(true)
                    {
                        self.last_repository_update = Some(tokio::time::Instant::now());
                        self.environment_version += Wrapping(1);
                        info!("loading package infos");
                        environment.load_package_infos(io, Some(http)).await?;
                    }
                }
                UpdateRepositoryMode::IfOutdatedOrNecessaryForLocal => {
                    if self
                        .last_repository_update
                        .map(|x| x.elapsed() > OUTDATED)
                        .unwrap_or(true)
                    {
                        self.last_repository_update = Some(tokio::time::Instant::now());
                        self.environment_version += Wrapping(1);
                        info!("loading local package infos");
                        environment.load_user_package_infos(io).await?;
                    }
                }
            }

            Ok(environment)
        } else {
            self.environment = Some(new_environment(io).await?);
            self.last_update = Some(tokio::time::Instant::now());
            let environment = self.environment.as_mut().unwrap();

            match update_repository {
                UpdateRepositoryMode::None => {}
                UpdateRepositoryMode::Force | UpdateRepositoryMode::IfOutdatedOrNecessary => {
                    self.last_repository_update = Some(tokio::time::Instant::now());
                    self.environment_version += Wrapping(1);
                    info!("loading package infos");
                    environment.load_package_infos(io, Some(http)).await?;
                }
                UpdateRepositoryMode::IfOutdatedOrNecessaryForLocal => {
                    self.last_repository_update = Some(tokio::time::Instant::now());
                    self.environment_version += Wrapping(1);
                    info!("loading local package infos");
                    environment.load_user_package_infos(io).await?;
                }
            }

            Ok(environment)
        }
    }
}

pub enum UpdateRepositoryMode {
    None,
    Force,
    IfOutdatedOrNecessary,
    IfOutdatedOrNecessaryForLocal,
}

impl EnvironmentState {
    fn new(io: DefaultEnvironmentIo, http: reqwest::Client) -> Self {
        Self {
            environment: EnvironmentHolder::new(),
            packages: None,
            projects: Box::new([]),
            projects_version: Wrapping(0),
            changes_info: crate::commands::ChangesInfoHolder::new(),
            io,
            http,
        }
    }
}
