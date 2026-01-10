using System.ComponentModel.DataAnnotations.Schema;

namespace todo2.Models.Db;

public class TodoTask
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }

    [ForeignKey(nameof(TodoList))]
    public Guid TodoListId { get; set; }
    public TodoList TodoList { get; set; } = null!;
}
