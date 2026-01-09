namespace todo2.Models.Dto;

public sealed record RegisterRequest(string Username, string Email, string Password);

public sealed record LoginRequest(string UsernameOrEmail, string Password);

public sealed record AuthResponse(string AccessToken);
