using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using todo2.Database;
using todo2.Models.Db;
using todo2.Models.Dto;
using todo2.Auth;

namespace todo2.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly AppDbContext _db;

    public PostController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PostResponse>>> GetPosts(CancellationToken ct, [FromQuery] int startIndex = 0)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var offset = startIndex < 0 ? 0 : startIndex;

        var posts = await _db.Posts
            .AsNoTracking()
            .Include(p => p.Comments)
            .OrderByDescending(p => p.CreatedAt)
            .Skip(offset)
            .Take(10)
            .ToListAsync(ct);

        return Ok(posts.Select(p => PostResponseMapper.ToResponse(p, userId)).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostResponse>> GetPost(Guid id, CancellationToken ct)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var post = await _db.Posts
            .AsNoTracking()
            .Include(p => p.Comments)
            .SingleOrDefaultAsync(p => p.Id == id, ct);

        if (post is null)
            return NotFound();

        return Ok(PostResponseMapper.ToResponse(post, userId));
    }

    [HttpPost]
    public async Task<ActionResult> CreatePost([FromBody] CreatePostRequest request, CancellationToken ct)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var todoList = await _db.TodoLists
            .AsNoTracking()
            .Include(t => t.Items)
            .Where(l => l.Id == request.TodoListId && l.UserId == userId)
            .SingleOrDefaultAsync(ct);

        if (todoList is null)
            return NotFound("Todo list not found.");

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Content = request.Content,
            TodoListAsJson = todoList.ToJson(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Posts.Add(post);

        await _db.SaveChangesAsync(ct);
        return Ok(new { post.Id });
    }

    [HttpPost("{postId:guid}/comments")]
    [Authorize]
    public async Task<ActionResult<PostCommentResponse>> CommentOnPost(Guid postId, [FromBody] CreatePostCommentRequest request, CancellationToken ct)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var post = await _db.Posts
            .AsNoTracking()
            .Where(p => p.Id == postId)
            .SingleOrDefaultAsync(ct);

        if (post is null)
            return NotFound("Post not found.");

        var commentText = request.CommentText.Trim();
        if (string.IsNullOrWhiteSpace(commentText))
            return BadRequest(new { error = "Comment text is required." });

        var comment = new PostComment
        {
            Id = Guid.NewGuid(),
            PostId = post.Id,
            CommentText = commentText,
            UserId = userId
        };

        _db.PostComments.Add(comment);
        await _db.SaveChangesAsync(ct);

        return Ok(new PostCommentResponse(comment.Id, comment.PostId, comment.UserId, comment.CommentText, comment.LikesCount));
    }

    [HttpPost("{postId:guid}/likes")]
    public async Task<ActionResult> LikePost(Guid postId, [FromBody] LikePostRequest request, CancellationToken ct)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var post = await _db.Posts.FirstOrDefaultAsync(p => p.Id == postId, ct);

        if (post == null)
            return NotFound("Post not found.");

        post.LikesCount += request.LikesCount;
        long likesCount = post.LikesCount;
        await _db.SaveChangesAsync(ct);

        return Ok(new { postId, likesCount });
    }

    [HttpPost("comments/{commentId:guid}/likes")]
    public async Task<ActionResult> LikeComment(Guid commentId, [FromBody] LikePostCommentRequest request, CancellationToken ct)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var comment = await _db.PostComments.FirstOrDefaultAsync(c => c.Id == commentId, ct);

        if (comment == null)
            return NotFound("Comment not found.");

        comment.LikesCount += request.LikesCount;
        long likesCount = comment.LikesCount;
        await _db.SaveChangesAsync(ct);

        return Ok(new { commentId, likesCount });
    }
}
