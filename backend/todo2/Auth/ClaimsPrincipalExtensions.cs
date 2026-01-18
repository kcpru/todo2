using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace todo2.Auth;

public static class ClaimsPrincipalExtensions
{
    public static bool TryGetUserId(this ClaimsPrincipal principal, out Guid userId)
    {
        var sub = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        return Guid.TryParse(sub, out userId);
    }
}
