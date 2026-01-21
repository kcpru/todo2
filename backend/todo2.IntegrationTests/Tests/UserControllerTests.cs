using Microsoft.AspNetCore.Identity;
using System.Net;
using System.Net.Http.Headers;
using todo2.IntegrationTests.Base;
using todo2.Models.Dto;
using Xunit;

namespace todo2.IntegrationTests.Tests;

public sealed class UserControllerTests : IntegrationTestBase
{
    public UserControllerTests(PostgresContainerFixture pg) : base(pg) { }

    [Fact]
    public async Task POST_registers_user_then_GET_me_returns_user_details()
    {
        // POST
        var request = new RegisterRequest("testuser", "testuser@gmail.com", "Password123");
        var post = await Client.PostAsJsonAsync("/api/user/register", request);

        Assert.Equal(HttpStatusCode.OK, post.StatusCode);

        var authResponse = await post.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(authResponse);
        Assert.NotEmpty(authResponse.AccessToken);

        using var req = new HttpRequestMessage(HttpMethod.Get, "/api/user/me");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authResponse.AccessToken);

        using var meGet = await Client.SendAsync(req);
        Assert.Equal(HttpStatusCode.OK, meGet.StatusCode);

        var meResponse = await meGet.Content.ReadFromJsonAsync<MeResponse>();
        Assert.NotNull(meResponse);
        Assert.Equal("testuser", meResponse.Username);
        Assert.Equal("testuser@gmail.com", meResponse.Email);
    }
}
