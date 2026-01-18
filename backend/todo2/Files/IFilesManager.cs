namespace todo2.Files;

public interface IFilesManager
{
    Task SaveAsync(string relativePath, Stream content, CancellationToken ct);
    Task<Stream?> OpenReadAsync(string relativePath, CancellationToken ct);
    Task<bool> ExistsAsync(string relativePath, CancellationToken ct);
}
