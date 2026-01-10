namespace todo2.Models.Db;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public int Coins { get; set; } = 0; // Currency for dopamine mode
}
