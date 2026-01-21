using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Respawn;
using Respawn.Graph;
using todo2.Database;
using todo2.Models.Db;
using Xunit;

namespace todo2.IntegrationTests.Base;

[Collection("postgres")]
public abstract class IntegrationTestBase : IAsyncLifetime
{
    protected readonly HttpClient Client;
    private readonly TestApiFactory _factory;

    private NpgsqlConnection _dbConn = default!;
    private Respawner _respawner = default!;

    private static readonly Table[] TablesToIgnore = [new Table("__EFMigrationsHistory")];

    protected IntegrationTestBase(PostgresContainerFixture pg)
    {
        _factory = new TestApiFactory(pg.Container.GetConnectionString());
        Client = _factory.CreateClient();
    }

    public virtual async Task SeedDatabase(AppDbContext db, IPasswordHasher<User> passwordHasher) { }

    public async Task InitializeAsync()
    {
        _dbConn = new NpgsqlConnection(_factory.ConnectionString);
        await _dbConn.OpenAsync();

        _respawner = await Respawner.CreateAsync(_dbConn, new RespawnerOptions
        {
            DbAdapter = DbAdapter.Postgres,
            SchemasToInclude = ["public"],
            TablesToIgnore = TablesToIgnore
        });

        await _respawner.ResetAsync(_dbConn);

        await using var scope = _factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

        await SeedDatabase(db, passwordHasher);

        await db.SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        await _dbConn.DisposeAsync();
        _factory.Dispose();
    }
}
