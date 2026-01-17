using Microsoft.AspNetCore.Identity;
using todo2.Models.Db;

namespace todo2.Database;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context, IPasswordHasher<User> passwordHasher)
    {
        // Check if data already exists
        if (context.Users.Any())
        {
            return;
        }

        // Create users
        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "admin",
            Email = "admin@example.com",
            PasswordHash = passwordHasher.HashPassword(null!, "password")
        };

        var user1 = new User
        {
            Id = Guid.NewGuid(),
            Username = "john_doe",
            Email = "john@example.com",
            PasswordHash = passwordHasher.HashPassword(null!, "password123")
        };

        var user2 = new User
        {
            Id = Guid.NewGuid(),
            Username = "jane_smith",
            Email = "jane@example.com",
            PasswordHash = passwordHasher.HashPassword(null!, "password123")
        };

        var user3 = new User
        {
            Id = Guid.NewGuid(),
            Username = "bob_wilson",
            Email = "bob@example.com",
            PasswordHash = passwordHasher.HashPassword(null!, "password123")
        };

        context.Users.AddRange(adminUser, user1, user2, user3);
        await context.SaveChangesAsync();

        // Create todo lists for admin
        var adminList1 = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Work Projects",
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            UpdatedAt = DateTime.UtcNow.AddDays(-5),
            UserId = adminUser.Id,
            IsPublic = true,
            Items = []
        };

        var adminList2 = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Personal Goals",
            CreatedAt = DateTime.UtcNow.AddDays(-20),
            UpdatedAt = DateTime.UtcNow,
            UserId = adminUser.Id,
            IsPublic = true,
            Items = []
        };

        context.TodoLists.AddRange(adminList1, adminList2);
        await context.SaveChangesAsync();

        // Create tasks for admin lists
        var tasks1 = new List<TodoTask>
        {
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Complete project documentation",
                Description = "Write comprehensive documentation for the new API endpoints",
                IsCompleted = true,
                TodoListId = adminList1.Id
            },
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Review pull requests",
                Description = "Review and merge pending pull requests from the team",
                IsCompleted = false,
                TodoListId = adminList1.Id
            },
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Deploy to production",
                Description = "Deploy latest version to production server",
                IsCompleted = false,
                TodoListId = adminList1.Id
            }
        };

        var tasks2 = new List<TodoTask>
        {
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Learn new programming language",
                Description = "Complete Rust programming course",
                IsCompleted = false,
                TodoListId = adminList2.Id
            },
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Exercise 3 times a week",
                Description = "Maintain healthy workout routine",
                IsCompleted = true,
                TodoListId = adminList2.Id
            }
        };

        context.TodoTasks.AddRange(tasks1);
        context.TodoTasks.AddRange(tasks2);
        adminList1.Items = tasks1;
        adminList2.Items = tasks2;
        await context.SaveChangesAsync();

        // Create todo lists for other users
        var user1List = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Shopping List",
            CreatedAt = DateTime.UtcNow.AddDays(-10),
            UpdatedAt = DateTime.UtcNow.AddDays(-2),
            UserId = user1.Id,
            Items = []
        };

        var user2List = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Travel Plans",
            CreatedAt = DateTime.UtcNow.AddDays(-7),
            UpdatedAt = DateTime.UtcNow.AddDays(-1),
            UserId = user2.Id,
            Items = []
        };

        var user3List = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Home Renovation",
            CreatedAt = DateTime.UtcNow.AddDays(-14),
            UpdatedAt = DateTime.UtcNow,
            UserId = user3.Id,
            Items = []
        };

        context.TodoLists.AddRange(user1List, user2List, user3List);
        await context.SaveChangesAsync();

        // Create tasks for other users
        var user1Tasks = new List<TodoTask>
        {
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Buy groceries",
                Description = "Milk, eggs, bread, vegetables",
                IsCompleted = false,
                TodoListId = user1List.Id
            },
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Get gas",
                Description = "Fill up the car",
                IsCompleted = true,
                TodoListId = user1List.Id
            }
        };

        var user2Tasks = new List<TodoTask>
        {
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Book flights",
                Description = "Book return flights to Paris for summer vacation",
                IsCompleted = false,
                TodoListId = user2List.Id
            },
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Reserve hotel",
                Description = "Reserve 5-star hotel in central Paris",
                IsCompleted = false,
                TodoListId = user2List.Id
            }
        };

        var user3Tasks = new List<TodoTask>
        {
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Paint living room",
                Description = "Paint walls in light blue color",
                IsCompleted = false,
                TodoListId = user3List.Id
            },
            new TodoTask
            {
                Id = Guid.NewGuid(),
                Title = "Install new fixtures",
                Description = "Replace old light fixtures with new ones",
                IsCompleted = true,
                TodoListId = user3List.Id
            }
        };

        context.TodoTasks.AddRange(user1Tasks);
        context.TodoTasks.AddRange(user2Tasks);
        context.TodoTasks.AddRange(user3Tasks);
        user1List.Items = user1Tasks;
        user2List.Items = user2Tasks;
        user3List.Items = user3Tasks;
        await context.SaveChangesAsync();

        // Create posts from different users
        var posts = new List<Post>
        {
            new Post
            {
                Id = Guid.NewGuid(),
                Content = "Just completed my work project documentation! Really proud of the comprehensive API guide I created. Ready to share with the team. 🚀",
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5),
                TodoListAsJson = adminList1.ToJson(),
                Comments = [],
                Likes = []
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Content = "Started learning Rust! Really excited about this new journey. Already completed the first few chapters of the book. #programming #rust",
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddDays(-3),
                TodoListAsJson = adminList2.ToJson(),
                Comments = [],
                Likes = []
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Content = "Finally got all my groceries! Meal prep for the week is ready. Time to cook! 👨‍🍳",
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-2),
                TodoListAsJson = user1List.ToJson(),
                Comments = [],
                Likes = []
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Content = "Booked my dream vacation to Paris! Can't wait for summer. Planning to visit the Eiffel Tower, Louvre Museum, and many cafes! ✈️🇫🇷",
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1),
                TodoListAsJson = user2List.ToJson(),
                Comments = [],
                Likes = []
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Content = "Living room renovation is coming along great! Just installed the new light fixtures and they look amazing. Next step: painting! 🏠",
                CreatedAt = DateTime.UtcNow.AddHours(-12),
                UpdatedAt = DateTime.UtcNow.AddHours(-12),
                TodoListAsJson = user3List.ToJson(),
                Comments = [],
                Likes = []
            }
        };

        context.Posts.AddRange(posts);
        await context.SaveChangesAsync();

        // Add some likes to posts
        var postLikes = new List<PostLike>
        {
            new PostLike { Id = Guid.NewGuid(), PostId = posts[0].Id, UserId = user1.Id },
            new PostLike { Id = Guid.NewGuid(), PostId = posts[0].Id, UserId = user2.Id },
            new PostLike { Id = Guid.NewGuid(), PostId = posts[1].Id, UserId = user3.Id },
            new PostLike { Id = Guid.NewGuid(), PostId = posts[2].Id, UserId = adminUser.Id },
            new PostLike { Id = Guid.NewGuid(), PostId = posts[3].Id, UserId = adminUser.Id },
            new PostLike { Id = Guid.NewGuid(), PostId = posts[3].Id, UserId = user1.Id },
            new PostLike { Id = Guid.NewGuid(), PostId = posts[4].Id, UserId = user2.Id },
        };

        context.PostLikes.AddRange(postLikes);

        // Add some comments to posts
        var postComments = new List<PostComment>
        {
            new PostComment
            {
                Id = Guid.NewGuid(),
                PostId = posts[0].Id,
                UserId = user1.Id,
                CommentText = "That's awesome! Great work on the documentation! 👍",
                Likes = []
            },
            new PostComment
            {
                Id = Guid.NewGuid(),
                PostId = posts[1].Id,
                UserId = user2.Id,
                CommentText = "Rust is so cool! Good luck with your learning journey!",
                Likes = []
            },
            new PostComment
            {
                Id = Guid.NewGuid(),
                PostId = posts[3].Id,
                UserId = user3.Id,
                CommentText = "Paris is amazing! Don't forget to visit the catacombs!",
                Likes = []
            },
            new PostComment
            {
                Id = Guid.NewGuid(),
                PostId = posts[4].Id,
                UserId = adminUser.Id,
                CommentText = "Looking beautiful! Love the light fixtures choice!",
                Likes = []
            }
        };

        context.PostComments.AddRange(postComments);

        // Add likes to comments
        var commentLikes = new List<PostCommentLike>
        {
            new PostCommentLike { Id = Guid.NewGuid(), CommentId = postComments[0].Id, UserId = user3.Id },
            new PostCommentLike { Id = Guid.NewGuid(), CommentId = postComments[1].Id, UserId = adminUser.Id },
            new PostCommentLike { Id = Guid.NewGuid(), CommentId = postComments[2].Id, UserId = user1.Id },
        };

        context.PostCommentLikes.AddRange(commentLikes);

        await context.SaveChangesAsync();
    }
}
