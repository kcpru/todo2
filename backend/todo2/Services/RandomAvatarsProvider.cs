namespace todo2.Services;

public class RandomAvatarsProvider
{
    public const string HttpClientConfigurationName = "Avatars";

    private readonly HttpClient _http;

    public const string MiniAvsTypeUrl = "miniavs";
    public const string BottsTypeUrl = "bottts";

    public RandomAvatarsProvider(IHttpClientFactory factory)
    {
        _http = factory.CreateClient(HttpClientConfigurationName);
    }

    public async Task<byte[]?> GetAvatarAsync(string avatarTypeUrl, CancellationToken ct)
    {
        var seed = Guid.NewGuid().ToString();
        var url = $"{avatarTypeUrl}/svg?seed={Uri.EscapeDataString(seed)}";
        using var resp = await _http.GetAsync(url, ct);

        if (!resp.IsSuccessStatusCode)
            return null;

        var svgBytes = await resp.Content.ReadAsByteArrayAsync(ct);
        return svgBytes;
    }
}
