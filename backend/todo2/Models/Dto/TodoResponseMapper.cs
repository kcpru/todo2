using todo2.Models.Db;

namespace todo2.Models.Dto;

public static class TodoResponseMapper
{
    public static TodoTaskResponse ToTaskResponse(TodoTask t) =>
        new(t.Id, t.TodoListId, t.Title, t.Description, t.IsCompleted);

    public static TodoListResponse ToListResponse(TodoList l) =>
        new(l.Id, l.Name, l.CreatedAt, l.UpdatedAt, [.. l.Items.Select(ToTaskResponse)]);
}
