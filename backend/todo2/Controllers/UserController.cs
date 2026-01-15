using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using todo2.Auth;
using todo2.Database;
using todo2.Models.Db;
using todo2.Models.Dto;

namespace todo2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJwtTokenService _jwt;
    private readonly IPasswordHasher<User> _passwordHasher;

    public UserController(AppDbContext db, IJwtTokenService jwt, IPasswordHasher<User> passwordHasher)
    {
        _db = db;
        _jwt = jwt;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var username = request.Username.Trim();
        var email = request.Email.Trim();

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { error = "Username, email and password are required." });

        if (await _db.Users.AnyAsync(u => u.Username == username, ct))
            return Conflict(new { error = "Username is already taken." });

        if (await _db.Users.AnyAsync(u => u.Email == email, ct))
            return Conflict(new { error = "Email is already taken." });

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = username,
            Email = email
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);

        var token = _jwt.GenerateToken(user);
        return Ok(new AuthResponse(token));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var login = request.UsernameOrEmail.Trim();

        if (string.IsNullOrWhiteSpace(login) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { error = "Login and password are required." });

        var user = await _db.Users
            .SingleOrDefaultAsync(u => u.Username == login || u.Email == login, ct);

        if (user is null)
            return Unauthorized(new { error = "Invalid credentials." });

        var verify = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verify == PasswordVerificationResult.Failed)
            return Unauthorized(new { error = "Invalid credentials." });

        var token = _jwt.GenerateToken(user);
        return Ok(new AuthResponse(token));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<MeResponse>> Me(CancellationToken ct)
    {
        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!Guid.TryParse(sub, out var userId))
            return Unauthorized();

        var user = await _db.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(u => u.Id == userId, ct);

        if (user is null)
            return Unauthorized();

        return Ok(new MeResponse(user.Id, user.Username, user.Email));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponse>> GetUser(Guid id, CancellationToken ct)
    {
        var user = await _db.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(u => u.Id == id, ct);

        if (user is null)
            return NotFound();

        return Ok(new UserResponse(user.Username));
    }
}
