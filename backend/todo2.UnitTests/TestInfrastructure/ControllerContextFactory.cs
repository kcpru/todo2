using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace todo2.UnitTests.TestInfrastructure;

internal static class ControllerContextFactory
{
    public static ControllerContext CreateWithUserId(Guid? userId)
    {
        var httpContext = new DefaultHttpContext();

        if (userId is not null)
        {
            httpContext.User = new ClaimsPrincipal(
                new ClaimsIdentity(
                    [new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, userId.Value.ToString())],
                    authenticationType: "Test"));
        }

        return new ControllerContext { HttpContext = httpContext };
    }
}
