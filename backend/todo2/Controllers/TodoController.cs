using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using todo2.Database;
using todo2.Models.Db;
using todo2.Models.Dto;

namespace todo2.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TodoController : ControllerBase
{
    private readonly AppDbContext _db;

    public TodoController(AppDbContext db)
    {
        _db = db;
    }

    private bool TryGetUserId(out Guid userId)
    {
        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        return Guid.TryParse(sub, out userId);
    }

    // Lists

    [HttpGet("lists")]
    public async Task<ActionResult<IReadOnlyList<TodoListResponse>>> GetLists(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var lists = await _db.TodoLists
            .AsNoTracking()
            .Where(l => l.UserId == userId)
            .Include(l => l.Items)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync(ct);

        return Ok(lists.Select(TodoResponseMapper.ToListResponse).ToList());
    }

    [HttpGet("lists/{listId:guid}")]
    public async Task<ActionResult<TodoListResponse>> GetList(Guid listId, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var list = await _db.TodoLists
            .AsNoTracking()
            .Where(l => l.Id == listId && l.UserId == userId)
            .Include(l => l.Items)
            .SingleOrDefaultAsync(ct);

        if (list is null)
            return NotFound();

        return Ok(TodoResponseMapper.ToListResponse(list));
    }

    [HttpPost("lists")]
    public async Task<ActionResult<TodoListResponse>> CreateList([FromBody] TodoListCreateRequest request, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var name = request.Name.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { error = "Name is required." });

        var list = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            UserId = userId
        };

        _db.TodoLists.Add(list);
        await _db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(GetList), new { listId = list.Id }, new TodoListResponse(list.Id, list.Name, list.CreatedAt, list.UpdatedAt, []));
    }

    [HttpPut("lists/{listId:guid}")]
    public async Task<ActionResult<TodoListResponse>> UpdateList(Guid listId, [FromBody] TodoListUpdateRequest request, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var list = await _db.TodoLists
            .Where(l => l.Id == listId && l.UserId == userId)
            .Include(l => l.Items)
            .SingleOrDefaultAsync(ct);

        if (list is null)
            return NotFound();

        var name = request.Name.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(new { error = "Name is required." });

        list.Name = name;
        await _db.SaveChangesAsync(ct);

        return Ok(TodoResponseMapper.ToListResponse(list));
    }

    [HttpDelete("lists/{listId:guid}")]
    public async Task<IActionResult> DeleteList(Guid listId, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var list = await _db.TodoLists
            .Where(l => l.Id == listId && l.UserId == userId)
            .Include(l => l.Items)
            .SingleOrDefaultAsync(ct);

        if (list is null)
            return NotFound();

        _db.TodoTasks.RemoveRange(list.Items);
        _db.TodoLists.Remove(list);
        await _db.SaveChangesAsync(ct);

        return NoContent();
    }

    // Tasks

    [HttpGet("lists/{listId:guid}/tasks")]
    public async Task<ActionResult<IReadOnlyList<TodoTaskResponse>>> GetTasks(Guid listId, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var listExists = await _db.TodoLists.AnyAsync(l => l.Id == listId && l.UserId == userId, ct);
        if (!listExists)
            return NotFound();

        var tasks = await _db.TodoTasks
            .AsNoTracking()
            .Where(t => t.TodoListId == listId)
            .OrderBy(t => t.Title)
            .ToListAsync(ct);

        return Ok(tasks.Select(TodoResponseMapper.ToTaskResponse).ToList());
    }

    [HttpPost("lists/{listId:guid}/tasks")]
    public async Task<ActionResult<TodoTaskResponse>> CreateTask(Guid listId, [FromBody] TodoTaskCreateRequest request, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var listExists = await _db.TodoLists.AnyAsync(l => l.Id == listId && l.UserId == userId, ct);
        if (!listExists)
            return NotFound();

        var title = request.Title.Trim();
        if (string.IsNullOrWhiteSpace(title))
            return BadRequest(new { error = "Title is required." });

        var task = new TodoTask
        {
            Id = Guid.NewGuid(),
            TodoListId = listId,
            Title = title,
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description,
            IsCompleted = false
        };

        _db.TodoTasks.Add(task);
        await _db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(GetTasks), new { listId }, TodoResponseMapper.ToTaskResponse(task));
    }

    [HttpPut("tasks/{taskId:guid}")]
    public async Task<ActionResult<TodoTaskResponse>> UpdateTask(Guid taskId, [FromBody] TodoTaskUpdateRequest request, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var task = await _db.TodoTasks
            .Include(t => t.TodoList)
            .SingleOrDefaultAsync(t => t.Id == taskId, ct);

        if (task is null)
            return NotFound();

        if (task.TodoList.UserId != userId)
            return NotFound();

        var title = request.Title.Trim();
        if (string.IsNullOrWhiteSpace(title))
            return BadRequest(new { error = "Title is required." });

        task.Title = title;
        task.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description;
        task.IsCompleted = request.IsCompleted;

        await _db.SaveChangesAsync(ct);

        return Ok(TodoResponseMapper.ToTaskResponse(task));
    }

    [HttpPatch("tasks/{taskId:guid}")]
    public async Task<ActionResult<TodoTaskResponse>> PatchTask(Guid taskId, [FromBody] TodoTaskPatchRequest request, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var task = await _db.TodoTasks
            .Include(t => t.TodoList)
            .SingleOrDefaultAsync(t => t.Id == taskId, ct);

        if (task is null)
            return NotFound();

        if (task.TodoList.UserId != userId)
            return NotFound();

        if (request.IsCompleted is not null)
            task.IsCompleted = request.IsCompleted.Value;

        await _db.SaveChangesAsync(ct);

        return Ok(TodoResponseMapper.ToTaskResponse(task));
    }

    [HttpDelete("tasks/{taskId:guid}")]
    public async Task<IActionResult> DeleteTask(Guid taskId, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var task = await _db.TodoTasks
            .Include(t => t.TodoList)
            .SingleOrDefaultAsync(t => t.Id == taskId, ct);

        if (task is null)
            return NotFound();

        if (task.TodoList.UserId != userId)
            return NotFound();

        _db.TodoTasks.Remove(task);
        await _db.SaveChangesAsync(ct);

        return NoContent();
    }
}
