using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using todo2.Auth;
using todo2.Controllers;
using todo2.Database;
using todo2.Models.Db;
using todo2.Models.Dto;
using todo2.UnitTests.TestInfrastructure;

namespace todo2.UnitTests.Controllers;

[TestClass]
public class UserControllerTests
{
    private AppDbContext _db = default!;
    private DbConnection _conn = default!;

    private sealed class StubJwtTokenService : IJwtTokenService
    {
        public string GenerateToken(User user) => $"token-for-{user.Id}";
    }

    [TestInitialize]
    public void TestInitialize()
    {
        var (db, conn) = SqliteInMemoryDbFactory.CreateContext();
        _db = db;
        _conn = conn;
    }

    [TestCleanup]
    public async Task TestCleanup()
    {
        await _db.DisposeAsync();
        await _conn.DisposeAsync();
    }

    [TestMethod]
    public async Task GivenInvalidRegisterRequest_WhenRegister_ThenReturnsBadRequest()
    {
        var sut = new UserController(_db, new StubJwtTokenService(), new PasswordHasher<User>());

        var result = await sut.Register(new RegisterRequest(" ", " ", ""), CancellationToken.None);

        Assert.IsInstanceOfType<BadRequestObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenExistingUsername_WhenRegister_ThenReturnsConflict()
    {
        _db.Users.Add(new User { Id = Guid.NewGuid(), Username = "john", Email = "john@ex.com", PasswordHash = "x" });
        await _db.SaveChangesAsync();

        var sut = new UserController(_db, new StubJwtTokenService(), new PasswordHasher<User>());

        var result = await sut.Register(new RegisterRequest("john", "new@ex.com", "Pass123!"), CancellationToken.None);

        Assert.IsInstanceOfType<ConflictObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenExistingEmail_WhenRegister_ThenReturnsConflict()
    {
        _db.Users.Add(new User { Id = Guid.NewGuid(), Username = "john", Email = "john@ex.com", PasswordHash = "x" });
        await _db.SaveChangesAsync();

        var sut = new UserController(_db, new StubJwtTokenService(), new PasswordHasher<User>());

        var result = await sut.Register(new RegisterRequest("newuser", "john@ex.com", "Pass123!"), CancellationToken.None);

        Assert.IsInstanceOfType<ConflictObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenValidRegisterRequest_WhenRegister_ThenCreatesUserAndReturnsToken()
    {
        var sut = new UserController(_db, new StubJwtTokenService(), new PasswordHasher<User>());

        var result = await sut.Register(new RegisterRequest("  john ", "  john@ex.com ", "Pass123!"), CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);

        var response = ok.Value as AuthResponse;
        Assert.IsNotNull(response);

        Assert.AreEqual(1, await _db.Users.CountAsync());
        var user = await _db.Users.SingleAsync();
        Assert.AreEqual("john", user.Username);
        Assert.AreEqual("john@ex.com", user.Email);
        Assert.IsFalse(string.IsNullOrWhiteSpace(user.PasswordHash));

        Assert.AreEqual($"token-for-{user.Id}", response.AccessToken);
    }

    [TestMethod]
    public async Task GivenInvalidLoginRequest_WhenLogin_ThenReturnsBadRequest()
    {
        var sut = new UserController(_db, new StubJwtTokenService(), new PasswordHasher<User>());

        var result = await sut.Login(new LoginRequest(" ", ""), CancellationToken.None);

        Assert.IsInstanceOfType<BadRequestObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenUnknownUser_WhenLogin_ThenReturnsUnauthorized()
    {
        var sut = new UserController(_db, new StubJwtTokenService(), new PasswordHasher<User>());

        var result = await sut.Login(new LoginRequest("john", "Pass123!"), CancellationToken.None);

        Assert.IsInstanceOfType<UnauthorizedObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenWrongPassword_WhenLogin_ThenReturnsUnauthorized()
    {
        var hasher = new PasswordHasher<User>();
        var user = new User { Id = Guid.NewGuid(), Username = "john", Email = "john@ex.com" };
        user.PasswordHash = hasher.HashPassword(user, "CorrectPass123!");
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var sut = new UserController(_db, new StubJwtTokenService(), hasher);

        var result = await sut.Login(new LoginRequest("john", "WrongPass"), CancellationToken.None);

        Assert.IsInstanceOfType<UnauthorizedObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenValidUsernameAndPassword_WhenLogin_ThenReturnsToken()
    {
        var hasher = new PasswordHasher<User>();
        var user = new User { Id = Guid.NewGuid(), Username = "john", Email = "john@ex.com" };
        user.PasswordHash = hasher.HashPassword(user, "Pass123!");
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var sut = new UserController(_db, new StubJwtTokenService(), hasher);

        var result = await sut.Login(new LoginRequest("  john ", "Pass123!"), CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);
        var response = ok.Value as AuthResponse;
        Assert.IsNotNull(response);
        Assert.AreEqual($"token-for-{user.Id}", response.AccessToken);
    }

    [TestMethod]
    public async Task GivenValidEmailAndPassword_WhenLogin_ThenReturnsToken()
    {
        var hasher = new PasswordHasher<User>();
        var user = new User { Id = Guid.NewGuid(), Username = "john", Email = "john@ex.com" };
        user.PasswordHash = hasher.HashPassword(user, "Pass123!");
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var sut = new UserController(_db, new StubJwtTokenService(), hasher);

        var result = await sut.Login(new LoginRequest(" john@ex.com ", "Pass123!"), CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);
        var response = ok.Value as AuthResponse;
        Assert.IsNotNull(response);
        Assert.AreEqual($"token-for-{user.Id}", response.AccessToken);
    }

    [TestMethod]
    public async Task GivenNoSubClaim_WhenMe_ThenReturnsUnauthorized()
    {
        var sut = new UserController(_db, new StubJwtTokenService(), new PasswordHasher<User>())
        {
            ControllerContext = ControllerContextFactory.CreateWithUserId(userId: null)
        };

        var result = await sut.Me(CancellationToken.None);

        Assert.IsInstanceOfType<UnauthorizedResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenUnknownUserId_WhenMe_ThenReturnsUnauthorized()
    {
        var sut = new UserController(_db, new StubJwtTokenService(), new PasswordHasher<User>())
        {
            ControllerContext = ControllerContextFactory.CreateWithUserId(Guid.NewGuid())
        };

        var result = await sut.Me(CancellationToken.None);

        Assert.IsInstanceOfType<UnauthorizedResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenValidUserId_WhenMe_ThenReturnsMeResponse()
    {
        var user = new User { Id = Guid.NewGuid(), Username = "john", Email = "john@ex.com", PasswordHash = "x" };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var sut = new UserController(_db, new StubJwtTokenService(), new PasswordHasher<User>())
        {
            ControllerContext = ControllerContextFactory.CreateWithUserId(user.Id)
        };

        var result = await sut.Me(CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);

        var me = ok.Value as MeResponse;
        Assert.IsNotNull(me);
        Assert.AreEqual(user.Id, me.Id);
        Assert.AreEqual(user.Username, me.Username);
        Assert.AreEqual(user.Email, me.Email);
    }
}
