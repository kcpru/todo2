namespace todo2.Files;

public sealed class FileManager : IFilesManager
{
    private readonly string _contentRoot;

    public FileManager(string contentRoot)
    {
        _contentRoot = contentRoot;
    }

    private string GetAbsolutePath(string relativePath)
    {
        relativePath = relativePath.Replace('\u202A', ' ').Trim();
        relativePath = relativePath.TrimStart('/', '\\');
        relativePath = relativePath.Replace('/', Path.DirectorySeparatorChar);

        return Path.Combine(_contentRoot, relativePath);
    }

    public Task<bool> ExistsAsync(string relativePath, CancellationToken ct)
        => Task.FromResult(File.Exists(GetAbsolutePath(relativePath)));

    public Task<Stream?> OpenReadAsync(string relativePath, CancellationToken ct)
    {
        var path = GetAbsolutePath(relativePath);
        if (!File.Exists(path))
            return Task.FromResult<Stream?>(null);

        Stream stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 64 * 1024, useAsync: true);
        return Task.FromResult<Stream?>(stream);
    }

    public async Task SaveAsync(string relativePath, Stream content, CancellationToken ct)
    {
        var path = GetAbsolutePath(relativePath);
        var dir = Path.GetDirectoryName(path);
        if (!string.IsNullOrWhiteSpace(dir))
            Directory.CreateDirectory(dir);

        await using var fs = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None, bufferSize: 64 * 1024, useAsync: true);
        await content.CopyToAsync(fs, ct);
    }
}
