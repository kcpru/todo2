using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using todo2.Auth;
using todo2.Models.Db;

namespace todo2.UnitTests.Auth;

[TestClass]
public class JwtTokenServiceTests
{
    [TestMethod]
    public void GivenValidOptions_WhenGenerateToken_ThenReturnsJwtWithExpectedClaimsAndIssuerAudience()
    {
        var options = Options.Create(new JwtOptions
        {
            Key = new string('k', 64),
            Issuer = "todo2",
            Audience = "todo2-client",
            ExpiresMinutes = 60
        });

        var sut = new JwtTokenService(options);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "a@b.com",
            Username = "test",
            PasswordHash = "x"
        };

        var tokenString = sut.GenerateToken(user);

        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(tokenString);

        Assert.AreEqual(options.Value.Issuer, token.Issuer);
        Assert.IsTrue(token.Audiences.Contains(options.Value.Audience));

        var sub = token.Claims.Single(c => c.Type == JwtRegisteredClaimNames.Sub).Value;
        var email = token.Claims.Single(c => c.Type == JwtRegisteredClaimNames.Email).Value;

        Assert.AreEqual(user.Id.ToString(), sub);
        Assert.AreEqual(user.Email, email);
        Assert.IsTrue(token.ValidTo > DateTime.UtcNow);
    }
}
