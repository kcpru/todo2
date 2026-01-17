using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace todo2.Models.Db;

public class TodoTask
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }

    [JsonIgnore]
    [ForeignKey(nameof(TodoList))]
    public Guid TodoListId { get; set; }

    [JsonIgnore]
    public TodoList TodoList { get; set; } = null!;
}
