namespace todo2.Models.Db;

public class Post
{
    public Guid Id { get; set; }
    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string TodoListAsJson { get; set; } = null!;

    public ICollection<PostComment> Comments { get; set; } = [];
    public ICollection<PostLike> Likes { get; set; } = [];

    public int LikesCount => Likes.Count;
}