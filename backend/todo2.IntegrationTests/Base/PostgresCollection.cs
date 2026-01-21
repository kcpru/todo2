using Xunit;

namespace todo2.IntegrationTests.Base;

[CollectionDefinition("postgres")]
public sealed class PostgresCollection : ICollectionFixture<PostgresContainerFixture> { }
