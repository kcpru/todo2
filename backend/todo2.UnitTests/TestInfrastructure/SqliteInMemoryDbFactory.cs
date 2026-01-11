using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using todo2.Database;

namespace todo2.UnitTests.TestInfrastructure;

internal static class SqliteInMemoryDbFactory
{
    public static (AppDbContext Db, SqliteConnection Connection) CreateContext()
    {
        var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        var db = new AppDbContext(options);
        db.Database.EnsureCreated();

        return (db, connection);
    }
}
