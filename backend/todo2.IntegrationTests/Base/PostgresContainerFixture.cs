using Testcontainers.PostgreSql;
using Xunit;

namespace todo2.IntegrationTests.Base;

public sealed class PostgresContainerFixture : IAsyncLifetime
{
    public PostgreSqlContainer Container { get; } =
        new PostgreSqlBuilder("postgres:latest")
            .WithDatabase("itests")
            .WithUsername("postgres")
            .WithPassword("postgres")
            .Build();

    public Task InitializeAsync() => Container.StartAsync();

    public Task DisposeAsync() => Container.DisposeAsync().AsTask();
}
