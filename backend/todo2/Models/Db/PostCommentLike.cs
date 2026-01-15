using System.ComponentModel.DataAnnotations.Schema;

namespace todo2.Models.Db;

public class PostCommentLike
{
    public Guid Id { get; set; }

    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    [ForeignKey(nameof(Comment))]
    public Guid CommentId { get; set; }
    public PostComment Comment { get; set; } = null!;
}
