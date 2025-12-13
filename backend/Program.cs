using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using todo2.Database;

namespace todo2;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Logging.ClearProviders();
        builder.Logging.AddConsole();

        builder.Services.AddControllers();
        builder.Services.AddOpenApi();

        var keepAliveConnection = new SqliteConnection("Data Source=:memory:");
        keepAliveConnection.Open();

        builder.Services.AddSingleton(keepAliveConnection);

        builder.Services.AddDbContext<AppDbContext>((sp, opt) =>
        {
            var conn = sp.GetRequiredService<SqliteConnection>();
            opt.UseSqlite(conn);
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
