using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using todo2.Controllers;
using todo2.Database;
using todo2.Models.Db;
using todo2.Models.Dto;
using todo2.UnitTests.TestInfrastructure;

namespace todo2.UnitTests.Controllers;

[TestClass]
public class TodoControllerTests
{
    private AppDbContext _db = default!;
    private DbConnection _conn = default!;

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

    private static async Task SeedUserWithListsAndTasksAsync(AppDbContext db, Guid userId)
    {
        var user = new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" };

        var list1 = new TodoList { Id = Guid.NewGuid(), Name = "L1", UserId = userId, User = user, CreatedAt = DateTime.UtcNow.AddMinutes(-10) };
        var list2 = new TodoList { Id = Guid.NewGuid(), Name = "L2", UserId = userId, User = user, CreatedAt = DateTime.UtcNow.AddMinutes(-5) };

        var task1 = new TodoTask { Id = Guid.NewGuid(), TodoListId = list2.Id, TodoList = list2, Title = "b", Description = null, IsCompleted = false };
        var task2 = new TodoTask { Id = Guid.NewGuid(), TodoListId = list2.Id, TodoList = list2, Title = "a", Description = "d", IsCompleted = true };

        db.Users.Add(user);
        db.TodoLists.AddRange(list1, list2);
        db.TodoTasks.AddRange(task1, task2);
        await db.SaveChangesAsync();
    }

    private static TodoController CreateSut(AppDbContext db, Guid? userId)
        => new(db) { ControllerContext = ControllerContextFactory.CreateWithUserId(userId) };

    [TestMethod]
    public async Task GivenNoUserClaim_WhenGetLists_ThenUnauthorized()
    {
        var sut = CreateSut(_db, userId: null);

        var result = await sut.GetLists(CancellationToken.None);

        Assert.IsInstanceOfType<UnauthorizedResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenUserWithLists_WhenGetLists_ThenReturnsOnlyUsersListsOrderedByCreatedAtDesc()
    {
        var userId = Guid.NewGuid();
        await SeedUserWithListsAndTasksAsync(_db, userId);

        var otherUser = new User { Id = Guid.NewGuid(), Username = "o", Email = "o@ex.com", PasswordHash = "x" };
        _db.Users.Add(otherUser);
        _db.TodoLists.Add(new TodoList { Id = Guid.NewGuid(), Name = "OTHER", UserId = otherUser.Id, User = otherUser, CreatedAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.GetLists(CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);

        var lists = (ok.Value as IReadOnlyList<TodoListResponse>) ?? ((IEnumerable<TodoListResponse>)ok.Value!).ToList();

        Assert.HasCount(2, lists);
        Assert.IsTrue(lists[0].CreatedAt >= lists[1].CreatedAt);
        Assert.IsFalse(lists.Any(l => l.Name == "OTHER"));

        var listWithItems = lists.Single(l => l.Name == "L2");
        Assert.HasCount(2, listWithItems.Items);
    }

    [TestMethod]
    public async Task GivenListNotOwned_WhenGetList_ThenNotFound()
    {
        var userId = Guid.NewGuid();
        await SeedUserWithListsAndTasksAsync(_db, userId);

        var otherId = Guid.NewGuid();
        var otherUser = new User { Id = otherId, Username = "o", Email = "o@ex.com", PasswordHash = "x" };
        var otherList = new TodoList { Id = Guid.NewGuid(), Name = "OTHER", UserId = otherId, User = otherUser, CreatedAt = DateTime.UtcNow };
        _db.Users.Add(otherUser);
        _db.TodoLists.Add(otherList);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.GetList(otherList.Id, CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenOwnedList_WhenGetList_ThenOkWithItems()
    {
        var userId = Guid.NewGuid();
        await SeedUserWithListsAndTasksAsync(_db, userId);
 
        var owned = await _db.TodoLists.SingleAsync(l => l.Name == "L2");
 
        var sut = CreateSut(_db, userId);
 
        var result = await sut.GetList(owned.Id, CancellationToken.None);
 
        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);
 
        var list = ok.Value as TodoListResponse;
        Assert.IsNotNull(list);
        Assert.AreEqual(owned.Id, list.Id);
        Assert.HasCount(2, list.Items);
    }
 
    [TestMethod]
    public async Task GivenBlankName_WhenCreateList_ThenBadRequest()
    {
        var sut = CreateSut(_db, Guid.NewGuid());

        var result = await sut.CreateList(new TodoListCreateRequest(" "), CancellationToken.None);

        Assert.IsInstanceOfType<BadRequestObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenValidName_WhenCreateList_ThenCreatedAndPersisted()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.CreateList(new TodoListCreateRequest("  My List  "), CancellationToken.None);

        var created = result.Result as CreatedAtActionResult;
        Assert.IsNotNull(created);

        var createdList = created.Value as TodoListResponse;
        Assert.IsNotNull(createdList);
        Assert.IsEmpty(createdList.Items);

        Assert.AreEqual(1, await _db.TodoLists.CountAsync());
        var list = await _db.TodoLists.SingleAsync();
        Assert.AreEqual("My List", list.Name);
        Assert.AreEqual(userId, list.UserId);
    }

    [TestMethod]
    public async Task GivenNotFoundList_WhenUpdateList_ThenNotFound()
    {
        var sut = CreateSut(_db, Guid.NewGuid());

        var result = await sut.UpdateList(Guid.NewGuid(), new TodoListUpdateRequest("Name"), CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenBlankName_WhenUpdateList_ThenBadRequest()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        var list = new TodoList { Id = Guid.NewGuid(), Name = "Old", UserId = userId, CreatedAt = DateTime.UtcNow };
        _db.TodoLists.Add(list);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.UpdateList(list.Id, new TodoListUpdateRequest(" "), CancellationToken.None);

        Assert.IsInstanceOfType<BadRequestObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenOwnedList_WhenUpdateList_ThenUpdatesName()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        var list = new TodoList { Id = Guid.NewGuid(), Name = "Old", UserId = userId, CreatedAt = DateTime.UtcNow };
        _db.TodoLists.Add(list);
        await _db.SaveChangesAsync();
 
        var sut = CreateSut(_db, userId);
 
        var result = await sut.UpdateList(list.Id, new TodoListUpdateRequest("  New  "), CancellationToken.None);
 
        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);
 
        var updated = await _db.TodoLists.SingleAsync();
        Assert.AreEqual("New", updated.Name);
    }
 
    [TestMethod]
    public async Task GivenNotFoundList_WhenDeleteList_ThenNotFound()
    {
        var sut = CreateSut(_db, Guid.NewGuid());
 
        var result = await sut.DeleteList(Guid.NewGuid(), CancellationToken.None);
 
        Assert.IsInstanceOfType<NotFoundResult>(result);
    }

    [TestMethod]
    public async Task GivenOwnedListWithTasks_WhenDeleteList_ThenDeletesListAndTasks()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });

        var list = new TodoList { Id = Guid.NewGuid(), Name = "L", UserId = userId, CreatedAt = DateTime.UtcNow };
        var task = new TodoTask { Id = Guid.NewGuid(), TodoListId = list.Id, Title = "T", IsCompleted = false };
        _db.TodoLists.Add(list);
        _db.TodoTasks.Add(task);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.DeleteList(list.Id, CancellationToken.None);

        Assert.IsInstanceOfType<NoContentResult>(result);
        Assert.AreEqual(0, await _db.TodoLists.CountAsync());
        Assert.AreEqual(0, await _db.TodoTasks.CountAsync());
    }

    [TestMethod]
    public async Task GivenMissingList_WhenGetTasks_ThenNotFound()
    {
        var sut = CreateSut(_db, Guid.NewGuid());

        var result = await sut.GetTasks(Guid.NewGuid(), CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenListOwned_WhenGetTasks_ThenReturnsTasksOrderedByTitle()
    {
        var userId = Guid.NewGuid();
        await SeedUserWithListsAndTasksAsync(_db, userId);

        var list = await _db.TodoLists.SingleAsync(l => l.Name == "L2");

        var sut = CreateSut(_db, userId);

        var result = await sut.GetTasks(list.Id, CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);

        var tasks = (ok.Value as IReadOnlyList<TodoTaskResponse>) ?? ((IEnumerable<TodoTaskResponse>)ok.Value!).ToList();
        Assert.HasCount(2, tasks);
        Assert.AreEqual("a", tasks[0].Title);
        Assert.AreEqual("b", tasks[1].Title);
    }

    [TestMethod]
    public async Task GivenBlankTitle_WhenCreateTask_ThenBadRequest()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        var list = new TodoList { Id = Guid.NewGuid(), Name = "L", UserId = userId, CreatedAt = DateTime.UtcNow };
        _db.TodoLists.Add(list);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.CreateTask(list.Id, new TodoTaskCreateRequest(" ", null), CancellationToken.None);

        Assert.IsInstanceOfType<BadRequestObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenMissingList_WhenCreateTask_ThenNotFound()
    {
        var sut = CreateSut(_db, Guid.NewGuid());

        var result = await sut.CreateTask(Guid.NewGuid(), new TodoTaskCreateRequest("t", null), CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenValidTask_WhenCreateTask_ThenCreatedAndPersisted()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        var list = new TodoList { Id = Guid.NewGuid(), Name = "L", UserId = userId, CreatedAt = DateTime.UtcNow };
        _db.TodoLists.Add(list);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.CreateTask(list.Id, new TodoTaskCreateRequest("  Title  ", "desc"), CancellationToken.None);

        var created = result.Result as CreatedAtActionResult;
        Assert.IsNotNull(created);

        Assert.AreEqual(1, await _db.TodoTasks.CountAsync());
        var task = await _db.TodoTasks.SingleAsync();
        Assert.AreEqual("Title", task.Title);
        Assert.AreEqual("desc", task.Description);
        Assert.IsFalse(task.IsCompleted);
    }

    [TestMethod]
    public async Task GivenUnknownTask_WhenUpdateTask_ThenNotFound()
    {
        var sut = CreateSut(_db, Guid.NewGuid());

        var result = await sut.UpdateTask(Guid.NewGuid(), new TodoTaskUpdateRequest("t", null, false), CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenTaskNotOwned_WhenUpdateTask_ThenNotFound()
    {
        var ownerId = Guid.NewGuid();
        var otherId = Guid.NewGuid();

        _db.Users.Add(new User { Id = ownerId, Username = "o", Email = "o@ex.com", PasswordHash = "x" });
        _db.Users.Add(new User { Id = otherId, Username = "x", Email = "x@ex.com", PasswordHash = "x" });

        var list = new TodoList { Id = Guid.NewGuid(), Name = "L", UserId = ownerId, CreatedAt = DateTime.UtcNow };
        var task = new TodoTask { Id = Guid.NewGuid(), TodoListId = list.Id, Title = "T", IsCompleted = false };
        _db.TodoLists.Add(list);
        _db.TodoTasks.Add(task);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, otherId);

        var result = await sut.UpdateTask(task.Id, new TodoTaskUpdateRequest("New", null, true), CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenBlankTitle_WhenUpdateTask_ThenBadRequest()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        var list = new TodoList { Id = Guid.NewGuid(), Name = "L", UserId = userId, CreatedAt = DateTime.UtcNow };
        var task = new TodoTask { Id = Guid.NewGuid(), TodoListId = list.Id, Title = "T", IsCompleted = false };
        _db.TodoLists.Add(list);
        _db.TodoTasks.Add(task);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.UpdateTask(task.Id, new TodoTaskUpdateRequest(" ", null, true), CancellationToken.None);

        Assert.IsInstanceOfType<BadRequestObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenOwnedTask_WhenUpdateTask_ThenUpdatesFields()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        var list = new TodoList { Id = Guid.NewGuid(), Name = "L", UserId = userId, CreatedAt = DateTime.UtcNow };
        var task = new TodoTask { Id = Guid.NewGuid(), TodoListId = list.Id, Title = "T", Description = "d", IsCompleted = false };
        _db.TodoLists.Add(list);
        _db.TodoTasks.Add(task);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.UpdateTask(task.Id, new TodoTaskUpdateRequest("  New  ", " ", true), CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);

        var updated = await _db.TodoTasks.SingleAsync();
        Assert.AreEqual("New", updated.Title);
        Assert.IsNull(updated.Description);
        Assert.IsTrue(updated.IsCompleted);
    }

    [TestMethod]
    public async Task GivenUnknownTask_WhenPatchTask_ThenNotFound()
    {
        var sut = CreateSut(_db, Guid.NewGuid());

        var result = await sut.PatchTask(Guid.NewGuid(), new TodoTaskPatchRequest(true), CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenOwnedTask_WhenPatchTaskWithNull_ThenDoesNotChangeIsCompleted()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        var list = new TodoList { Id = Guid.NewGuid(), Name = "L", UserId = userId, CreatedAt = DateTime.UtcNow };
        var task = new TodoTask { Id = Guid.NewGuid(), TodoListId = list.Id, Title = "T", IsCompleted = false };
        _db.TodoLists.Add(list);
        _db.TodoTasks.Add(task);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.PatchTask(task.Id, new TodoTaskPatchRequest(null), CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);

        var updated = await _db.TodoTasks.SingleAsync();
        Assert.IsFalse(updated.IsCompleted);
    }

    [TestMethod]
    public async Task GivenOwnedTask_WhenPatchTaskWithValue_ThenUpdatesIsCompleted()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        var list = new TodoList { Id = Guid.NewGuid(), Name = "L", UserId = userId, CreatedAt = DateTime.UtcNow };
        var task = new TodoTask { Id = Guid.NewGuid(), TodoListId = list.Id, Title = "T", IsCompleted = false };
        _db.TodoLists.Add(list);
        _db.TodoTasks.Add(task);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.PatchTask(task.Id, new TodoTaskPatchRequest(true), CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);

        var updated = await _db.TodoTasks.SingleAsync();
        Assert.IsTrue(updated.IsCompleted);
    }

    [TestMethod]
    public async Task GivenUnknownTask_WhenDeleteTask_ThenNotFound()
    {
        var sut = CreateSut(_db, Guid.NewGuid());

        var result = await sut.DeleteTask(Guid.NewGuid(), CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundResult>(result);
    }

    [TestMethod]
    public async Task GivenTaskNotOwned_WhenDeleteTask_ThenNotFound()
    {
        var ownerId = Guid.NewGuid();
        var otherId = Guid.NewGuid();

        _db.Users.Add(new User { Id = ownerId, Username = "o", Email = "o@ex.com", PasswordHash = "x" });
        _db.Users.Add(new User { Id = otherId, Username = "x", Email = "x@ex.com", PasswordHash = "x" });

        var list = new TodoList { Id = Guid.NewGuid(), Name = "L", UserId = ownerId, CreatedAt = DateTime.UtcNow };
        var task = new TodoTask { Id = Guid.NewGuid(), TodoListId = list.Id, Title = "T", IsCompleted = false };
        _db.TodoLists.Add(list);
        _db.TodoTasks.Add(task);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, otherId);

        var result = await sut.DeleteTask(task.Id, CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundResult>(result);
    }

    [TestMethod]
    public async Task GivenOwnedTask_WhenDeleteTask_ThenNoContentAndRemovedFromDb()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        var list = new TodoList { Id = Guid.NewGuid(), Name = "L", UserId = userId, CreatedAt = DateTime.UtcNow };
        var task = new TodoTask { Id = Guid.NewGuid(), TodoListId = list.Id, Title = "T", IsCompleted = false };
        _db.TodoLists.Add(list);
        _db.TodoTasks.Add(task);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.DeleteTask(task.Id, CancellationToken.None);

        Assert.IsInstanceOfType<NoContentResult>(result);
        Assert.AreEqual(0, await _db.TodoTasks.CountAsync());
    }

    public TestContext TestContext { get; set; }
}
