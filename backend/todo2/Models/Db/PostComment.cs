using System.ComponentModel.DataAnnotations.Schema;

namespace todo2.Models.Db;

public class PostComment
{
    public Guid Id { get; set; }
    public string CommentText { get; set; } = null!;

    [ForeignKey(nameof(Post))]
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;

    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public ICollection<PostCommentLike> Likes { get; set; } = [];

    public int LikesCount => Likes.Count;
}
