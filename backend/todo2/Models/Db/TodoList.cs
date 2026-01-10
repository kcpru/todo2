using System.ComponentModel.DataAnnotations.Schema;

namespace todo2.Models.Db;

public class TodoList
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public ICollection<TodoTask> Items { get; set; } = [];
}
