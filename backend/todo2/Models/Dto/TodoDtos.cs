namespace todo2.Models.Dto;

public sealed record TodoListCreateRequest(string Name);
public sealed record TodoListUpdateRequest(string Name);

public sealed record TodoTaskCreateRequest(string Title, string? Description);
public sealed record TodoTaskUpdateRequest(string Title, string? Description, bool IsCompleted);
public sealed record TodoTaskPatchRequest(bool? IsCompleted);

public sealed record TodoTaskResponse(Guid Id, Guid TodoListId, string Title, string? Description, bool IsCompleted);

public sealed record TodoListResponse(Guid Id, string Name, DateTime CreatedAt, IReadOnlyList<TodoTaskResponse> Items);
