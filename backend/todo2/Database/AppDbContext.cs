using Microsoft.EntityFrameworkCore;
using todo2.Models.Db;

namespace todo2.Database;

public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<TodoList> TodoLists => Set<TodoList>();
    public DbSet<TodoTask> TodoTasks => Set<TodoTask>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}