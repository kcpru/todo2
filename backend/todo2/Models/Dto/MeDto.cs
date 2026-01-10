namespace todo2.Models.Dto;

public sealed record MeResponse(Guid Id, string Username, string Email, int Coins);
