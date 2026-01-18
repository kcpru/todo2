using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using todo2.Auth;
using todo2.Services;

namespace todo2.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MotivationController : ControllerBase
{
    private readonly MotivationMessagesProvider _motivationMessagesProvider;
    private readonly RandomAvatarsProvider _randomAvatarsProvider;

    public MotivationController(MotivationMessagesProvider motivationMessagesProvider, RandomAvatarsProvider randomAvatarsProvider)
    {
        _motivationMessagesProvider = motivationMessagesProvider;
        _randomAvatarsProvider = randomAvatarsProvider;
    }

    [HttpPost("list-done")]
    public async Task<ActionResult<string>> TaskDone([FromBody] TodoListDoneDto dto, CancellationToken ct)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var msg = await _motivationMessagesProvider.GenerateAsync(userId.ToString(), dto.TaskTitle, ct);
        return Ok(msg);
    }

    [HttpGet("random-avatar")]
    public async Task<ActionResult<byte[]>> GetRandomAvatar(CancellationToken ct)
    {
        var svgBytes = await _randomAvatarsProvider.GetAvatarAsync(ct);

        if (svgBytes is null || svgBytes.Length == 0)
            return NotFound();

        return File(svgBytes, "image/svg+xml");
    }
}

public record TodoListDoneDto(string TaskTitle);