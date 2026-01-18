namespace todo2.Models.Dto;

public record CreatePostRequest(Guid TodoListId, string Content);
public record CreatePostCommentRequest(string CommentText);
public record LikePostRequest(long LikesCount);
public record LikePostCommentRequest(long LikesCount);

public record PostResponse(Guid Id, string TodoListAsJson, string Content, long LikesCount, DateTime CreatedAt, DateTime UpdatedAt, IReadOnlyList<PostCommentResponse> Comments);
public record PostCommentResponse(Guid Id, Guid PostId, Guid UserId, string CommentText, long LikesCount);
