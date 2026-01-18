namespace todo2.Services;

public class RandomAvatarsProvider
{
    public const string HttpClientConfigurationName = "Avatars";

    private readonly HttpClient _http;

    public RandomAvatarsProvider(IHttpClientFactory factory)
    {
        _http = factory.CreateClient(HttpClientConfigurationName);
    }

    public async Task<byte[]?> GetAvatarAsync(CancellationToken ct = default)
    {
        var seed = Guid.NewGuid().ToString();
        var url = $"svg?seed={Uri.EscapeDataString(seed)}";
        using var resp = await _http.GetAsync(url, ct);

        if (!resp.IsSuccessStatusCode)
            return null;

        var svgBytes = await resp.Content.ReadAsByteArrayAsync(ct);
        return svgBytes;
    }
}
