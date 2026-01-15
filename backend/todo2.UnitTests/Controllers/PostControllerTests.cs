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
public class PostControllerTests
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

    private static PostController CreateSut(AppDbContext db, Guid? userId)
        => new(db) { ControllerContext = ControllerContextFactory.CreateWithUserId(userId) };

    [TestMethod]
    public async Task GivenPosts_WhenGetPosts_ThenReturnsOrderedWithComments()
    {
        var owner = new User { Id = Guid.NewGuid(), Username = "owner", Email = "owner@ex.com", PasswordHash = "x" };
        _db.Users.Add(owner);

        var list = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Public",
            UserId = owner.Id,
            CreatedAt = DateTime.UtcNow.AddMinutes(-5),
            UpdatedAt = DateTime.UtcNow.AddMinutes(-5)
        };
        _db.TodoLists.Add(list);

        var older = new Post
        {
            Id = Guid.NewGuid(),
            Content = "older",
            TodoListAsJson = list.ToJson(),
            CreatedAt = DateTime.UtcNow.AddMinutes(-2),
            UpdatedAt = DateTime.UtcNow.AddMinutes(-2)
        };

        var newer = new Post
        {
            Id = Guid.NewGuid(),
            Content = "newer",
            TodoListAsJson = list.ToJson(),
            CreatedAt = DateTime.UtcNow.AddMinutes(-1),
            UpdatedAt = DateTime.UtcNow.AddMinutes(-1)
        };
        _db.Posts.AddRange(older, newer);

        var commenter = new User { Id = Guid.NewGuid(), Username = "commenter", Email = "commenter@ex.com", PasswordHash = "x" };
        _db.Users.Add(commenter);

        var comment = new PostComment { Id = Guid.NewGuid(), PostId = newer.Id, UserId = commenter.Id, CommentText = "Nice!" };
        _db.PostComments.Add(comment);

        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId: null);

        var result = await sut.GetPosts(CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);

        var responses = (ok!.Value as IReadOnlyList<PostResponse>) ?? ((IEnumerable<PostResponse>)ok.Value!).ToList();

        Assert.HasCount(2, responses);
        Assert.AreEqual(newer.Id, responses[0].Id);
        Assert.AreEqual(older.Id, responses[1].Id);
        Assert.HasCount(1, responses[0].Comments);
        Assert.AreEqual("Nice!", responses[0].Comments[0].CommentText);
    }

    [TestMethod]
    public async Task GivenValidRequest_WhenCreatePost_ThenCreatesPost()
    {
        var ownerId = Guid.NewGuid();
        _db.Users.Add(new User { Id = ownerId, Username = "owner", Email = "owner@ex.com", PasswordHash = "x" });

        var list = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Public",
            UserId = ownerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.TodoLists.Add(list);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId: null);

        var result = await sut.CreatePost(new CreatePostRequest(list.Id, "content"), CancellationToken.None);

        var ok = result as OkObjectResult;
        Assert.IsNotNull(ok);

        Assert.AreEqual(1, await _db.Posts.CountAsync());
        var post = await _db.Posts.SingleAsync();
        Assert.AreEqual("content", post.Content);
        Assert.IsFalse(string.IsNullOrWhiteSpace(post.TodoListAsJson));

        var idProperty = ok!.Value?.GetType().GetProperty("Id");
        Assert.IsNotNull(idProperty);
        Assert.AreEqual(post.Id, (Guid)idProperty!.GetValue(ok.Value)!);
    }

    [TestMethod]
    public async Task GivenNoUserClaim_WhenCommentOnPost_ThenUnauthorized()
    {
        var sut = CreateSut(_db, userId: null);

        var result = await sut.CommentOnPost(Guid.NewGuid(), new CreatePostCommentRequest("text"), CancellationToken.None);

        Assert.IsInstanceOfType(result.Result, typeof(UnauthorizedResult));
    }

    [TestMethod]
    public async Task GivenUnknownPost_WhenCommentOnPost_ThenNotFound()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.CommentOnPost(Guid.NewGuid(), new CreatePostCommentRequest("comment"), CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenBlankComment_WhenCommentOnPost_ThenBadRequest()
    {
        var ownerId = Guid.NewGuid();
        var commenterId = Guid.NewGuid();

        _db.Users.Add(new User { Id = ownerId, Username = "owner", Email = "owner@ex.com", PasswordHash = "x" });
        _db.Users.Add(new User { Id = commenterId, Username = "commenter", Email = "commenter@ex.com", PasswordHash = "x" });

        var list = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Public",
            UserId = ownerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.TodoLists.Add(list);

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Content = "content",
            TodoListAsJson = list.ToJson(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, commenterId);

        var result = await sut.CommentOnPost(post.Id, new CreatePostCommentRequest(" "), CancellationToken.None);

        Assert.IsInstanceOfType<BadRequestObjectResult>(result.Result);
    }

    [TestMethod]
    public async Task GivenValidComment_WhenCommentOnPost_ThenCreatesComment()
    {
        var ownerId = Guid.NewGuid();
        var commenterId = Guid.NewGuid();

        _db.Users.Add(new User { Id = ownerId, Username = "owner", Email = "owner@ex.com", PasswordHash = "x" });
        _db.Users.Add(new User { Id = commenterId, Username = "commenter", Email = "commenter@ex.com", PasswordHash = "x" });

        var list = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Public",
            UserId = ownerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.TodoLists.Add(list);

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Content = "content",
            TodoListAsJson = list.ToJson(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, commenterId);

        var result = await sut.CommentOnPost(post.Id, new CreatePostCommentRequest("  nice  "), CancellationToken.None);

        var ok = result.Result as OkObjectResult;
        Assert.IsNotNull(ok);

        var response = ok!.Value as PostCommentResponse;
        Assert.IsNotNull(response);
        Assert.AreEqual(post.Id, response.PostId);
        Assert.AreEqual(commenterId, response.UserId);
        Assert.AreEqual("nice", response.CommentText);
        Assert.AreEqual(0, response.LikesCount);

        var comment = await _db.PostComments.SingleAsync();
        Assert.AreEqual(post.Id, comment.PostId);
        Assert.AreEqual(commenterId, comment.UserId);
        Assert.AreEqual("nice", comment.CommentText);
    }

    [TestMethod]
    public async Task GivenNoUserClaim_WhenLikePost_ThenUnauthorized()
    {
        var sut = CreateSut(_db, userId: null);

        var result = await sut.LikePost(Guid.NewGuid(), CancellationToken.None);

        Assert.IsInstanceOfType<UnauthorizedResult>(result);
    }

    [TestMethod]
    public async Task GivenUnknownPost_WhenLikePost_ThenNotFound()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.LikePost(Guid.NewGuid(), CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundObjectResult>(result);
    }

    [TestMethod]
    public async Task GivenValidPost_WhenLikePostTwice_ThenCreatesSingleLikeAndReturnsCount()
    {
        var ownerId = Guid.NewGuid();
        var likerId = Guid.NewGuid();
        _db.Users.Add(new User { Id = ownerId, Username = "owner", Email = "owner@ex.com", PasswordHash = "x" });
        _db.Users.Add(new User { Id = likerId, Username = "liker", Email = "liker@ex.com", PasswordHash = "x" });

        var list = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Public",
            UserId = ownerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.TodoLists.Add(list);

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Content = "content",
            TodoListAsJson = list.ToJson(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, likerId);

        var first = await sut.LikePost(post.Id, CancellationToken.None);
        var ok1 = first as OkObjectResult;
        Assert.IsNotNull(ok1);

        var second = await sut.LikePost(post.Id, CancellationToken.None);
        var ok2 = second as OkObjectResult;
        Assert.IsNotNull(ok2);

        Assert.AreEqual(1, await _db.PostLikes.CountAsync());

        var likesCountProperty = ok2!.Value?.GetType().GetProperty("likesCount");
        Assert.IsNotNull(likesCountProperty);
        Assert.AreEqual(1, (int)likesCountProperty!.GetValue(ok2.Value)!);
    }

    [TestMethod]
    public async Task GivenLikedPost_WhenUnlikePost_ThenRemovesLikeAndReturnsCount()
    {
        var ownerId = Guid.NewGuid();
        var likerId = Guid.NewGuid();
        _db.Users.Add(new User { Id = ownerId, Username = "owner", Email = "owner@ex.com", PasswordHash = "x" });
        _db.Users.Add(new User { Id = likerId, Username = "liker", Email = "liker@ex.com", PasswordHash = "x" });

        var list = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Public",
            UserId = ownerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.TodoLists.Add(list);

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Content = "content",
            TodoListAsJson = list.ToJson(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Posts.Add(post);

        _db.PostLikes.Add(new PostLike { Id = Guid.NewGuid(), PostId = post.Id, UserId = likerId });
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, likerId);

        var result = await sut.UnlikePost(post.Id, CancellationToken.None);
        var ok = result as OkObjectResult;
        Assert.IsNotNull(ok);

        Assert.AreEqual(0, await _db.PostLikes.CountAsync());

        var likesCountProperty = ok!.Value?.GetType().GetProperty("likesCount");
        Assert.IsNotNull(likesCountProperty);
        Assert.AreEqual(0, (int)likesCountProperty!.GetValue(ok.Value)!);
    }

    [TestMethod]
    public async Task GivenNoUserClaim_WhenLikeComment_ThenUnauthorized()
    {
        var sut = CreateSut(_db, userId: null);

        var result = await sut.LikeComment(Guid.NewGuid(), CancellationToken.None);

        Assert.IsInstanceOfType(result, typeof(UnauthorizedResult));
    }

    [TestMethod]
    public async Task GivenUnknownComment_WhenLikeComment_ThenNotFound()
    {
        var userId = Guid.NewGuid();
        _db.Users.Add(new User { Id = userId, Username = "u", Email = "u@ex.com", PasswordHash = "x" });
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, userId);

        var result = await sut.LikeComment(Guid.NewGuid(), CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundObjectResult>(result);
    }

    [TestMethod]
    public async Task GivenValidComment_WhenLikeCommentTwice_ThenCreatesSingleLikeAndReturnsCount()
    {
        var ownerId = Guid.NewGuid();
        var commenterId = Guid.NewGuid();
        var likerId = Guid.NewGuid();

        _db.Users.Add(new User { Id = ownerId, Username = "owner", Email = "owner@ex.com", PasswordHash = "x" });
        _db.Users.Add(new User { Id = commenterId, Username = "commenter", Email = "commenter@ex.com", PasswordHash = "x" });
        _db.Users.Add(new User { Id = likerId, Username = "liker", Email = "liker@ex.com", PasswordHash = "x" });

        var list = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Public",
            UserId = ownerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.TodoLists.Add(list);

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Content = "content",
            TodoListAsJson = list.ToJson(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Posts.Add(post);

        var comment = new PostComment { Id = Guid.NewGuid(), PostId = post.Id, UserId = commenterId, CommentText = "Nice!" };
        _db.PostComments.Add(comment);

        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, likerId);

        var first = await sut.LikeComment(comment.Id, CancellationToken.None);
        var ok1 = first as OkObjectResult;
        Assert.IsNotNull(ok1);

        var second = await sut.LikeComment(comment.Id, CancellationToken.None);
        var ok2 = second as OkObjectResult;
        Assert.IsNotNull(ok2);

        Assert.AreEqual(1, await _db.PostCommentLikes.CountAsync());

        var likesCountProperty = ok2!.Value?.GetType().GetProperty("likesCount");
        Assert.IsNotNull(likesCountProperty);
        Assert.AreEqual(1, (int)likesCountProperty!.GetValue(ok2.Value)!);
    }

    [TestMethod]
    public async Task GivenLikedComment_WhenUnlikeComment_ThenRemovesLikeAndReturnsCount()
    {
        var ownerId = Guid.NewGuid();
        var commenterId = Guid.NewGuid();
        var likerId = Guid.NewGuid();

        _db.Users.Add(new User { Id = ownerId, Username = "owner", Email = "owner@ex.com", PasswordHash = "x" });
        _db.Users.Add(new User { Id = commenterId, Username = "commenter", Email = "commenter@ex.com", PasswordHash = "x" });
        _db.Users.Add(new User { Id = likerId, Username = "liker", Email = "liker@ex.com", PasswordHash = "x" });

        var list = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Public",
            UserId = ownerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.TodoLists.Add(list);

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Content = "content",
            TodoListAsJson = list.ToJson(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Posts.Add(post);

        var comment = new PostComment { Id = Guid.NewGuid(), PostId = post.Id, UserId = commenterId, CommentText = "Nice!" };
        _db.PostComments.Add(comment);

        _db.PostCommentLikes.Add(new PostCommentLike { Id = Guid.NewGuid(), CommentId = comment.Id, UserId = likerId });
        await _db.SaveChangesAsync();

        var sut = CreateSut(_db, likerId);

        var result = await sut.UnlikeComment(comment.Id, CancellationToken.None);
        var ok = result as OkObjectResult;
        Assert.IsNotNull(ok);

        Assert.AreEqual(0, await _db.PostCommentLikes.CountAsync());

        var likesCountProperty = ok!.Value?.GetType().GetProperty("likesCount");
        Assert.IsNotNull(likesCountProperty);
        Assert.AreEqual(0, (int)likesCountProperty!.GetValue(ok.Value)!);
    }
}
