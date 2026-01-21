using System.Net;
using System.Net.Http.Headers;
using todo2.Models.Dto;
using Xunit;

namespace todo2.IntegrationTests.Utilities;

internal static class HttpUtil
{
    public static async Task<string> LoginAndGetAccessToken(HttpClient client, string usernameOrEmail = "test", string password = "password")
    {
        var login = new LoginRequest(usernameOrEmail, password);
        using var loginPost = await client.PostAsJsonAsync("/api/user/login", login);

        Assert.Equal(HttpStatusCode.OK, loginPost.StatusCode);

        var authResponse = await loginPost.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(authResponse);
        Assert.NotEmpty(authResponse.AccessToken);

        return authResponse.AccessToken;
    }

    public static HttpRequestMessage Authed(HttpMethod method, string url, string accessToken, HttpContent? content = null)
    {
        var req = new HttpRequestMessage(method, url);
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        req.Content = content;
        return req;
    }
}
