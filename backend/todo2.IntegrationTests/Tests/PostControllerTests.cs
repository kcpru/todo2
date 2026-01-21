using Microsoft.AspNetCore.Identity;
using System.Net;
using todo2.Database;
using todo2.IntegrationTests.Base;
using todo2.IntegrationTests.Utilities;
using todo2.Models.Db;
using todo2.Models.Dto;
using Xunit;

namespace todo2.IntegrationTests.Tests;

public sealed class PostControllerTests : IntegrationTestBase
{
    public PostControllerTests(PostgresContainerFixture pg) : base(pg) { }

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
            Title = "Seed task",
            Description = "Seed task",
            IsCompleted = false,
            TodoListId = todoListId
        });

        // A post+comment for read/like tests
        var postId = Guid.NewGuid();
        db.Posts.Add(new Post
        {
            Id = postId,
            Content = "Seed post",
            TodoListAsJson = "{}",
            LikesCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        db.PostComments.Add(new PostComment
        {
            Id = Guid.NewGuid(),
            PostId = postId,
            UserId = userId,
            CommentText = "Seed comment",
            LikesCount = 0
        });
    }

    [Fact]
    public async Task GET_posts_requires_auth()
    {
        using var get = await Client.GetAsync("/api/post");
        Assert.Equal(HttpStatusCode.Unauthorized, get.StatusCode);
    }

    [Fact]
    public async Task POST_creates_post_then_GET_posts_contains_it()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        var listsReq = HttpUtil.Authed(HttpMethod.Get, "/api/todo/lists", accessToken);
        using var listsRes = await Client.SendAsync(listsReq);
        Assert.Equal(HttpStatusCode.OK, listsRes.StatusCode);

        var lists = await listsRes.Content.ReadFromJsonAsync<IReadOnlyList<TodoListResponse>>();
        Assert.NotNull(lists);

        var listId = lists.Single(l => l.Name == "Sample List").Id;

        using var create = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, "/api/post", accessToken, JsonContent.Create(new CreatePostRequest(listId, "Hello post"))));

        Assert.Equal(HttpStatusCode.OK, create.StatusCode);

        var created = await create.Content.ReadFromJsonAsync<Dictionary<string, Guid>>();
        Assert.NotNull(created);
        Assert.True(created.TryGetValue("id", out var createdId));
        Assert.NotEqual(Guid.Empty, createdId);

        using var getPosts = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, "/api/post", accessToken));
        Assert.Equal(HttpStatusCode.OK, getPosts.StatusCode);

        var posts = await getPosts.Content.ReadFromJsonAsync<IReadOnlyList<PostResponse>>();
        Assert.NotNull(posts);
        Assert.Contains(posts, p => p.Id == createdId && p.Content == "Hello post");
    }

    [Fact]
    public async Task POST_create_post_invalid_todolist_returns_not_found()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        using var create = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, "/api/post", accessToken, JsonContent.Create(new CreatePostRequest(Guid.NewGuid(), "Hello post"))));

        Assert.Equal(HttpStatusCode.NotFound, create.StatusCode);
    }

    [Fact]
    public async Task POST_comment_trims_and_rejects_whitespace()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        using var getPosts = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, "/api/post", accessToken));
        Assert.Equal(HttpStatusCode.OK, getPosts.StatusCode);

        var posts = await getPosts.Content.ReadFromJsonAsync<IReadOnlyList<PostResponse>>();
        Assert.NotNull(posts);
        var postId = posts.Single(p => p.Content == "Seed post").Id;

        using var ok = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, $"/api/post/{postId}/comments", accessToken, JsonContent.Create(new CreatePostCommentRequest("  nice  "))));
        Assert.Equal(HttpStatusCode.OK, ok.StatusCode);

        var comment = await ok.Content.ReadFromJsonAsync<PostCommentResponse>();
        Assert.NotNull(comment);
        Assert.Equal("nice", comment.CommentText);

        using var bad = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, $"/api/post/{postId}/comments", accessToken, JsonContent.Create(new CreatePostCommentRequest("   "))));
        Assert.Equal(HttpStatusCode.BadRequest, bad.StatusCode);
    }

    [Fact]
    public async Task POST_like_post_increments_likes()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        using var getPosts = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, "/api/post", accessToken));
        Assert.Equal(HttpStatusCode.OK, getPosts.StatusCode);

        var posts = await getPosts.Content.ReadFromJsonAsync<IReadOnlyList<PostResponse>>();
        Assert.NotNull(posts);
        var post = posts.Single(p => p.Content == "Seed post");

        using var like = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, $"/api/post/{post.Id}/likes", accessToken, JsonContent.Create(new LikePostRequest(2))));
        Assert.Equal(HttpStatusCode.OK, like.StatusCode);

        var payload = await like.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(payload);

        using var getOne = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, $"/api/post/{post.Id}", accessToken));
        Assert.Equal(HttpStatusCode.OK, getOne.StatusCode);

        var refreshed = await getOne.Content.ReadFromJsonAsync<PostResponse>();
        Assert.NotNull(refreshed);
        Assert.Equal(post.LikesCount + 2, refreshed.LikesCount);
    }

    [Fact]
    public async Task POST_like_post_rejects_negative()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        using var getPosts = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, "/api/post", accessToken));
        Assert.Equal(HttpStatusCode.OK, getPosts.StatusCode);

        var posts = await getPosts.Content.ReadFromJsonAsync<IReadOnlyList<PostResponse>>();
        Assert.NotNull(posts);
        var postId = posts.Single(p => p.Content == "Seed post").Id;

        using var like = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, $"/api/post/{postId}/likes", accessToken, JsonContent.Create(new LikePostRequest(-1))));

        Assert.Equal(HttpStatusCode.BadRequest, like.StatusCode);
    }

    [Fact]
    public async Task POST_like_comment_increments_likes()
    {
        var accessToken = await HttpUtil.LoginAndGetAccessToken(Client);

        using var getOne = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, "/api/post", accessToken));
        Assert.Equal(HttpStatusCode.OK, getOne.StatusCode);

        var posts = await getOne.Content.ReadFromJsonAsync<IReadOnlyList<PostResponse>>();
        Assert.NotNull(posts);

        var post = posts.Single(p => p.Content == "Seed post");
        var comment = Assert.Single(post.Comments);

        using var like = await Client.SendAsync(
            HttpUtil.Authed(HttpMethod.Post, $"/api/post/comments/{comment.Id}/likes", accessToken, JsonContent.Create(new LikePostCommentRequest(3))));
        Assert.Equal(HttpStatusCode.OK, like.StatusCode);

        using var refreshedPost = await Client.SendAsync(HttpUtil.Authed(HttpMethod.Get, $"/api/post/{post.Id}", accessToken));
        Assert.Equal(HttpStatusCode.OK, refreshedPost.StatusCode);

        var refreshed = await refreshedPost.Content.ReadFromJsonAsync<PostResponse>();
        Assert.NotNull(refreshed);

        var refreshedComment = refreshed.Comments.Single(c => c.Id == comment.Id);
        Assert.Equal(comment.LikesCount + 3, refreshedComment.LikesCount);
    }
}
