using Microsoft.EntityFrameworkCore;

namespace todo2.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}