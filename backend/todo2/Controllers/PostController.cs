using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using todo2.Database;
using todo2.Models.Db;
using todo2.Models.Dto;

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

    private bool TryGetUserId(out Guid userId)
    {
        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        return Guid.TryParse(sub, out userId);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PostResponse>>> GetPosts(CancellationToken ct, [FromQuery] int startIndex = 0)
    {
        var offset = startIndex < 0 ? 0 : startIndex;

        var posts = await _db.Posts
            .AsNoTracking()
            .Include(p => p.Comments)
            .OrderByDescending(p => p.CreatedAt)
            .Skip(offset)
            .Take(10)
            .ToListAsync(ct);

        return Ok(posts.Select(PostResponseMapper.ToResponse).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostResponse>> GetPost(Guid id, CancellationToken ct)
    {
        var post = await _db.Posts
            .AsNoTracking()
            .Include(p => p.Comments)
            .SingleOrDefaultAsync(p => p.Id == id, ct);

        if (post is null)
            return NotFound();

        return Ok(PostResponseMapper.ToResponse(post));
    }

    [HttpPost]
    public async Task<ActionResult> CreatePost([FromBody] CreatePostRequest request, CancellationToken ct)
    {
        var todoList = await _db.TodoLists
            .AsNoTracking()
            .Where(l => l.Id == request.TodoListId)
            .SingleOrDefaultAsync(ct);

        if (todoList is null)
            return NotFound("Todo list not found or is not public.");

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
        if (!TryGetUserId(out var userId))
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
    public async Task<ActionResult> LikePost(Guid postId, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var postExists = await _db.Posts
            .AsNoTracking()
            .AnyAsync(p => p.Id == postId, ct);

        if (!postExists)
            return NotFound("Post not found.");

        var alreadyLiked = await _db.PostLikes
            .AsNoTracking()
            .AnyAsync(l => l.PostId == postId && l.UserId == userId, ct);

        if (!alreadyLiked)
        {
            _db.PostLikes.Add(new PostLike
            {
                Id = Guid.NewGuid(),
                PostId = postId,
                UserId = userId
            });

            await _db.SaveChangesAsync(ct);
        }

        var likesCount = await _db.PostLikes
            .AsNoTracking()
            .CountAsync(l => l.PostId == postId, ct);

        return Ok(new { postId, likesCount });
    }

    [HttpDelete("{postId:guid}/likes")]
    public async Task<ActionResult> UnlikePost(Guid postId, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var postExists = await _db.Posts
            .AsNoTracking()
            .AnyAsync(p => p.Id == postId, ct);

        if (!postExists)
            return NotFound("Post not found.");

        var like = await _db.PostLikes
            .SingleOrDefaultAsync(l => l.PostId == postId && l.UserId == userId, ct);

        if (like is not null)
        {
            _db.PostLikes.Remove(like);
            await _db.SaveChangesAsync(ct);
        }

        var likesCount = await _db.PostLikes
            .AsNoTracking()
            .CountAsync(l => l.PostId == postId, ct);

        return Ok(new { postId, likesCount });
    }

    [HttpPost("comments/{commentId:guid}/likes")]
    public async Task<ActionResult> LikeComment(Guid commentId, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var commentExists = await _db.PostComments
            .AsNoTracking()
            .AnyAsync(c => c.Id == commentId, ct);

        if (!commentExists)
            return NotFound("Comment not found.");

        var alreadyLiked = await _db.PostCommentLikes
            .AsNoTracking()
            .AnyAsync(l => l.CommentId == commentId && l.UserId == userId, ct);

        if (!alreadyLiked)
        {
            _db.PostCommentLikes.Add(new PostCommentLike
            {
                Id = Guid.NewGuid(),
                CommentId = commentId,
                UserId = userId
            });

            await _db.SaveChangesAsync(ct);
        }

        var likesCount = await _db.PostCommentLikes
            .AsNoTracking()
            .CountAsync(l => l.CommentId == commentId, ct);

        return Ok(new { commentId, likesCount });
    }

    [HttpDelete("comments/{commentId:guid}/likes")]
    public async Task<ActionResult> UnlikeComment(Guid commentId, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var commentExists = await _db.PostComments
            .AsNoTracking()
            .AnyAsync(c => c.Id == commentId, ct);

        if (!commentExists)
            return NotFound("Comment not found.");

        var like = await _db.PostCommentLikes
            .SingleOrDefaultAsync(l => l.CommentId == commentId && l.UserId == userId, ct);

        if (like is not null)
        {
            _db.PostCommentLikes.Remove(like);
            await _db.SaveChangesAsync(ct);
        }

        var likesCount = await _db.PostCommentLikes
            .AsNoTracking()
            .CountAsync(l => l.CommentId == commentId, ct);

        return Ok(new { commentId, likesCount });
    }
}
