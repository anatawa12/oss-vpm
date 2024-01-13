using System.Runtime.InteropServices;
using System.Text;

namespace vrc_get_litedb;

/// <summary>
/// This class contains low-level FFI utilities.
/// </summary>
public static class LowLevelFfiUtils
{
    [UnmanagedCallersOnly(EntryPoint = "vrc_get_litedb_lowlevel_free_gc_handle")]
    private static void FreeGcHandle(nint handle) => GCHandle.FromIntPtr(handle).Free();

    public static UTF8Encoding FfiUtf8 = new(false, true);
}

public unsafe struct ByteSlice
{
    public byte* Data;
    public int Length;

    public ByteSlice(byte* data, int length)
    {
        Data = data;
        Length = length;
    }

    public Span<byte> AsSpan() => new(Data, Length);
    public ReadOnlySpan<byte> AsReadOnlySpan() => new(Data, Length);
    public string ToUtf8String() => LowLevelFfiUtils.FfiUtf8.GetString(AsReadOnlySpan());

    [DllImport("*", EntryPoint = "vrc_get_litedb_lowlevel_alloc_byte_slice")]
    private static extern byte* AllocByteSlice(nuint length);

    public static ByteSlice NewBoxedStrOnRustMemory(string data)
    {
        var length = LowLevelFfiUtils.FfiUtf8.GetByteCount(data);
        var ptr = AllocByteSlice((nuint)length);
        LowLevelFfiUtils.FfiUtf8.GetBytes(data, new Span<byte>(ptr, length));
        return new ByteSlice(ptr, length);
    }
}

[StructLayout(LayoutKind.Sequential)]
internal static class Tests
{
    [DllImport("*", EntryPoint = "test_returns_hello_rust")]
    private static extern ByteSlice TestReturnsHelloRust();

    [UnmanagedCallersOnly(EntryPoint = "test_call_returns_hello_rust")]
    public static bool CallReturnsHelloRust()
    {
        var helloWorld = TestReturnsHelloRust();
        return helloWorld.ToUtf8String() == "Hello, Rust!";
    }
    
    [UnmanagedCallersOnly(EntryPoint = "test_returns_hello_csharp")]
    public static ByteSlice TestReturnsHelloCsharp() => ByteSlice.NewBoxedStrOnRustMemory("Hello, C#!");
}
