using System.ComponentModel.DataAnnotations.Schema;

namespace todo2.Models.Db;

public class PostLike
{
    public Guid Id { get; set; }

    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    [ForeignKey(nameof(Post))]
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;
}
