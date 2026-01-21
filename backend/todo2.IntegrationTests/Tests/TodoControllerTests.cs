using Microsoft.AspNetCore.Identity;
using System.Net;
using todo2.Database;
using todo2.IntegrationTests.Base;
using todo2.IntegrationTests.Utilities;
using todo2.Models.Db;
using todo2.Models.Dto;
using Xunit;

namespace todo2.IntegrationTests.Tests;

public class TodoControllerTests : IntegrationTestBase
{
    public TodoControllerTests(PostgresContainerFixture pg) : base(pg) { }

    public override async Task SeedDatabase(AppDbContext db, IPasswordHasher<User> passwordHasher)
    {
        var userId = Guid.NewGuid();
        var todoListId = Guid.NewGuid();

        db.Users.Add(new User
        {
            Id = userId,
            Username = "test",
            Email = "test@example.com",
            PasswordHash = passwordHasher.HashPassword(null!, "password")
        });

        db.TodoLists.Add(new TodoList
        {
            Id = todoListId,
            Name = "Sample List",
            UserId = userId
        });

        db.TodoTasks.Add(new TodoTask
        {
            Id = Guid.NewGuid(),
            Title = "Sample Task",
            Description = "Sample Task",
            IsCompleted = false,
            TodoListId = todoListId
        });

        db.TodoTasks.Add(new TodoTask
        {
            Id = Guid.NewGuid(),
            Title = "Another Task",
            Description = "Another Task",
            IsCompleted = true,
            TodoListId = todoListId
        });

        var otherUserId = Guid.NewGuid();
        db.Users.Add(new User
        {
            Id = otherUserId,
            Username = "other",
            Email = "other@example.com",
            PasswordHash = passwordHasher.HashPassword(null!, "password")
        });

        db.TodoLists.Add(new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Other user list",
            UserId = otherUserId
        });
    }

    [Fact]
    public async Task POST_creates_new_todo_list_GET_returns_this_list()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        // POST create list
        var createRequest = new TodoListCreateRequest("My new list");

        using var createPost = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, "/api/todo/lists", accessToken, JsonContent.Create(createRequest)));
        Assert.Equal(HttpStatusCode.Created, createPost.StatusCode);

        var created = await createPost.Content.ReadFromJsonAsync<TodoListResponse>();
        Assert.NotNull(created);
        Assert.Equal("My new list", created.Name);
        Assert.Empty(created.Items);

        // GET lists should include created list
        using var get = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, "/api/todo/lists", accessToken));
        Assert.Equal(HttpStatusCode.OK, get.StatusCode);

        var lists = await get.Content.ReadFromJsonAsync<IReadOnlyList<TodoListResponse>>();
        Assert.NotNull(lists);

        var found = lists.SingleOrDefault(l => l.Id == created.Id);
        Assert.NotNull(found);
        Assert.Equal(created.Name, found.Name);
    }

    [Fact]
    public async Task GET_lists_requires_auth()
    {
        using var get = await Client.GetAsync("/api/todo/lists");
        Assert.Equal(HttpStatusCode.Unauthorized, get.StatusCode);
    }

    [Fact]
    public async Task GET_lists_returns_only_users_lists()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        using var get = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, "/api/todo/lists", accessToken));
        Assert.Equal(HttpStatusCode.OK, get.StatusCode);

        var lists = await get.Content.ReadFromJsonAsync<IReadOnlyList<TodoListResponse>>();
        Assert.NotNull(lists);
        Assert.DoesNotContain(lists, l => l.Name == "Other user list");
        Assert.Contains(lists, l => l.Name == "Sample List");
    }

    [Fact]
    public async Task POST_list_trims_name_and_rejects_whitespace()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        using var createOk = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, "/api/todo/lists", accessToken, JsonContent.Create(new TodoListCreateRequest("  My list  "))));
        Assert.Equal(HttpStatusCode.Created, createOk.StatusCode);

        var created = await createOk.Content.ReadFromJsonAsync<TodoListResponse>();
        Assert.NotNull(created);
        Assert.Equal("My list", created.Name);

        using var createBad = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, "/api/todo/lists", accessToken, JsonContent.Create(new TodoListCreateRequest("   "))));
        Assert.Equal(HttpStatusCode.BadRequest, createBad.StatusCode);
    }

    [Fact]
    public async Task PUT_list_updates_name_and_GET_by_id_returns_updated()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        using var create = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, "/api/todo/lists", accessToken, JsonContent.Create(new TodoListCreateRequest("Old name"))));
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);

        var created = await create.Content.ReadFromJsonAsync<TodoListResponse>();
        Assert.NotNull(created);

        using var update = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Put, $"/api/todo/lists/{created.Id}", accessToken, JsonContent.Create(new TodoListUpdateRequest("New name"))));
        Assert.Equal(HttpStatusCode.OK, update.StatusCode);

        var updated = await update.Content.ReadFromJsonAsync<TodoListResponse>();
        Assert.NotNull(updated);
        Assert.Equal(created.Id, updated.Id);
        Assert.Equal("New name", updated.Name);

        using var get = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, $"/api/todo/lists/{created.Id}", accessToken));
        Assert.Equal(HttpStatusCode.OK, get.StatusCode);

        var got = await get.Content.ReadFromJsonAsync<TodoListResponse>();
        Assert.NotNull(got);
        Assert.Equal("New name", got.Name);
    }

    [Fact]
    public async Task Tasks_CRUD_flow_create_list_create_task_get_tasks_update_patch_delete()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        using var createList = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, "/api/todo/lists", accessToken, JsonContent.Create(new TodoListCreateRequest("Task list"))));
        Assert.Equal(HttpStatusCode.Created, createList.StatusCode);

        var list = await createList.Content.ReadFromJsonAsync<TodoListResponse>();
        Assert.NotNull(list);

        // Create task
        using var createTask = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, $"/api/todo/lists/{list.Id}/tasks", accessToken, JsonContent.Create(new TodoTaskCreateRequest("  Title  ", "desc"))));
        Assert.Equal(HttpStatusCode.Created, createTask.StatusCode);

        var task = await createTask.Content.ReadFromJsonAsync<TodoTaskResponse>();
        Assert.NotNull(task);
        Assert.Equal(list.Id, task.TodoListId);
        Assert.Equal("Title", task.Title);
        Assert.Equal("desc", task.Description);
        Assert.False(task.IsCompleted);

        // Get tasks
        using var getTasks = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, $"/api/todo/lists/{list.Id}/tasks", accessToken));
        Assert.Equal(HttpStatusCode.OK, getTasks.StatusCode);

        var tasks = await getTasks.Content.ReadFromJsonAsync<IReadOnlyList<TodoTaskResponse>>();
        Assert.NotNull(tasks);
        Assert.Contains(tasks, t => t.Id == task.Id);

        // Update task
        using var updateTask = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Put, $"/api/todo/tasks/{task.Id}", accessToken, JsonContent.Create(new TodoTaskUpdateRequest("New title", null, true))));
        Assert.Equal(HttpStatusCode.OK, updateTask.StatusCode);

        var updated = await updateTask.Content.ReadFromJsonAsync<TodoTaskResponse>();
        Assert.NotNull(updated);
        Assert.Equal("New title", updated.Title);
        Assert.Null(updated.Description);
        Assert.True(updated.IsCompleted);

        // Patch task (toggle completion)
        using var patchTask = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Patch, $"/api/todo/tasks/{task.Id}", accessToken, JsonContent.Create(new TodoTaskPatchRequest(false))));
        Assert.Equal(HttpStatusCode.OK, patchTask.StatusCode);

        var patched = await patchTask.Content.ReadFromJsonAsync<TodoTaskResponse>();
        Assert.NotNull(patched);
        Assert.False(patched.IsCompleted);

        // Delete task
        using var deleteTask = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Delete, $"/api/todo/tasks/{task.Id}", accessToken));
        Assert.Equal(HttpStatusCode.NoContent, deleteTask.StatusCode);

        // After deletion task should not be in list
        using var getTasksAfter = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, $"/api/todo/lists/{list.Id}/tasks", accessToken));
        Assert.Equal(HttpStatusCode.OK, getTasksAfter.StatusCode);

        var tasksAfter = await getTasksAfter.Content.ReadFromJsonAsync<IReadOnlyList<TodoTaskResponse>>();
        Assert.NotNull(tasksAfter);
        Assert.DoesNotContain(tasksAfter, t => t.Id == task.Id);
    }

    [Fact]
    public async Task DELETE_list_removes_list_and_its_tasks()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        using var createList = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, "/api/todo/lists", accessToken, JsonContent.Create(new TodoListCreateRequest("List to delete"))));
        Assert.Equal(HttpStatusCode.Created, createList.StatusCode);

        var list = await createList.Content.ReadFromJsonAsync<TodoListResponse>();
        Assert.NotNull(list);

        using var createTask = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, $"/api/todo/lists/{list.Id}/tasks", accessToken, JsonContent.Create(new TodoTaskCreateRequest("Task", null))));
        Assert.Equal(HttpStatusCode.Created, createTask.StatusCode);

        using var deleteList = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Delete, $"/api/todo/lists/{list.Id}", accessToken));
        Assert.Equal(HttpStatusCode.NoContent, deleteList.StatusCode);

        using var getList = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, $"/api/todo/lists/{list.Id}", accessToken));
        Assert.Equal(HttpStatusCode.NotFound, getList.StatusCode);

        using var getTasks = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, $"/api/todo/lists/{list.Id}/tasks", accessToken));
        Assert.Equal(HttpStatusCode.NotFound, getTasks.StatusCode);
    }
}
