using todo2.Models.Db;

namespace todo2.Auth;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}