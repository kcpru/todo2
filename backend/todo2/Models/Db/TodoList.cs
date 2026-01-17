using System.Text.Json.Serialization;

﻿using System.ComponentModel.DataAnnotations.Schema;

namespace todo2.Models.Db;

public class TodoList
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsPublic { get; set; } = false;

    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    [JsonIgnore]
    public User User { get; set; } = null!;

    public ICollection<TodoTask> Items { get; set; } = [];

    public string ToJson()
    {
        var options = new System.Text.Json.JsonSerializerOptions
        {
            PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
            ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles
        };
        return System.Text.Json.JsonSerializer.Serialize(this, options);
    }
}
