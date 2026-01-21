#pragma warning disable IDE1006 // Naming Styles
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

namespace todo2.Services;

public class MotivationMessagesProvider
{
    private static readonly string[] Fallbacks =
    {
        "Well done, job done.",
        "Great, another task checked off.",
        "Great! Small victories make all the difference."
    };

    private readonly HttpClient _http;
    private readonly IMemoryCache _cache;
    private static readonly JsonSerializerOptions jsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };

    private const int SecondsCooldown = 5;

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
                new ChatMessage("system", "Generate a short, motivating eulogy in English. Simply 1 sentence, up to 20 words. No moralizing."),
                new ChatMessage("user",
                    taskTitle is { Length: > 0 }
                        ? $"User completed the task: \"{taskTitle}\". Write a praise that relates to this completed task."
                        : "User completed the task. Write a compliment.")
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

            _cache.Set(cooldownKey, text, TimeSpan.FromSeconds(SecondsCooldown));
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