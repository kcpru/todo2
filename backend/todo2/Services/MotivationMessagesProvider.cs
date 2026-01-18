#pragma warning disable IDE1006 // Naming Styles
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

namespace todo2.Services;

public class MotivationMessagesProvider
{
    private static readonly string[] Fallbacks =
    {
        "Dobra robota — zadanie zrobione.",
        "Super, kolejny krok odhaczony.",
        "Świetnie! Małe zwycięstwa robią różnicę."
    };

    private readonly HttpClient _http;
    private readonly IMemoryCache _cache;
    private static readonly JsonSerializerOptions jsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };

    public static string HttpClientConfigurationName => "Groq";

    public MotivationMessagesProvider(IHttpClientFactory factory, IMemoryCache cache)
    {
        _http = factory.CreateClient(HttpClientConfigurationName);
        _cache = cache;
    }

    public async Task<string> GenerateAsync(string userId, string? taskTitle, CancellationToken ct = default)
    {
        var cooldownKey = $"motivate:cooldown:{userId}";

        if (_cache.TryGetValue(cooldownKey, out string? cached))
            return cached!;

        var req = new ChatCompletionRequest
        {
            model = "llama-3.1-8b-instant",
            temperature = 0.8,
            max_tokens = 60,
            messages = new()
            {
                new ChatMessage("system", "Generuj krótką motywującą pochwałę po polsku. Po prostu 1 zdanie, do 20 słów. Bez moralizowania."),
                new ChatMessage("user",
                    taskTitle is { Length: > 0 }
                        ? $"Użytkownik wykonał zadanie: \"{taskTitle}\". Napisz pochwałę, która nawiązuje do tego wykonanego zadania."
                        : "Użytkownik wykonał zadanie. Napisz pochwałę.")
            }
        };

        try
        {
            using var resp = await _http.PostAsJsonAsync("chat/completions", req, ct);
            resp.EnsureSuccessStatusCode();

            var json = await resp.Content.ReadAsStringAsync(ct);
            var parsed = JsonSerializer.Deserialize<ChatCompletionResponse>(json, jsonSerializerOptions);

            var text = parsed?.choices?.FirstOrDefault()?.message?.content?.Trim();
            if (string.IsNullOrWhiteSpace(text))
                text = PickFallback();

            _cache.Set(cooldownKey, text, TimeSpan.FromSeconds(10));
            return text;
        }
        catch
        {
            return PickFallback();
        }
    }

    private static string PickFallback()
        => Fallbacks[Random.Shared.Next(Fallbacks.Length)];
}

public sealed class ChatCompletionRequest
{
    public string model { get; set; } = "";
    public List<ChatMessage> messages { get; set; } = [];
    public double temperature { get; set; } = 0.8;
    public int max_tokens { get; set; } = 60;
}

public sealed record ChatMessage(string role, string content);

public sealed class ChatCompletionResponse
{
    public List<Choice>? choices { get; set; }

    public sealed class Choice
    {
        public ChatMessage? message { get; set; }
    }
}
#pragma warning restore IDE1006 // Naming Styles