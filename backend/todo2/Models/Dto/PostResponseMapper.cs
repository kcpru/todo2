using todo2.Models.Db;

namespace todo2.Models.Dto;

public static class PostResponseMapper
{
    public static PostResponse ToResponse(Post post)
    {
        var comments = post.Comments
            .Select(c => new PostCommentResponse(c.Id, c.PostId, c.UserId, c.CommentText, c.LikesCount))
            .ToList();

        return new PostResponse(post.Id, post.TodoListAsJson, post.Content, post.LikesCount, post.CreatedAt, post.UpdatedAt, comments);
    }
}
