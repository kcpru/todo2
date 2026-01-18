using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text;
using todo2.Auth;
using todo2.Database;
using todo2.Files;
using todo2.Models.Db;
using todo2.Services;

namespace todo2;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args); builder.Logging.ClearProviders();
        builder.Logging.AddConsole();

        builder.Services.AddControllers();

        builder.Services.AddExceptionHandler(options =>
        {
            options.ExceptionHandlingPath = "/error";
        });
        builder.Services.AddProblemDetails();

        builder.Services.AddMemoryCache();

        builder.Services.AddHttpClient(MotivationMessagesProvider.HttpClientConfigurationName, client =>
        {
            var baseUrl = builder.Configuration["Groq:BaseUrl"]!;
            var apiKey = builder.Configuration["Groq:ApiKey"]!;

            client.BaseAddress = new Uri(baseUrl);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
        });

        builder.Services.AddHttpClient(RandomAvatarsProvider.HttpClientConfigurationName, client =>
        {
            client.BaseAddress = new Uri(builder.Configuration["RandomAvatars:BaseUrl"]!);
        });

        builder.Services.AddScoped<MotivationMessagesProvider>();
        builder.Services.AddScoped<RandomAvatarsProvider>();
        builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

        builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
        builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        builder.Services.AddSingleton<IFilesManager>(new FileManager(builder.Environment.ContentRootPath));

        var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>()!;

        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)),
                    ClockSkew = TimeSpan.Zero,
                    NameClaimType = JwtRegisteredClaimNames.Sub,
                    RoleClaimType = System.Security.Claims.ClaimTypes.Role
                };
            });

        builder.Services.AddAuthorization();

        var connectionString = builder.Configuration.GetConnectionString("Default")
            ?? throw new InvalidOperationException("Missing connection string 'ConnectionStrings:Default'.");

        builder.Services.AddDbContext<AppDbContext>(opt =>
        {
            opt.UseNpgsql(connectionString, npgsql =>
            {
                npgsql.CommandTimeout(10);
                npgsql.EnableRetryOnFailure(maxRetryCount: 10, maxRetryDelay: TimeSpan.FromSeconds(1), errorCodesToAdd: null);
            });
        });

        var spaOrigin = builder.Configuration["Cors:SpaOrigin"] ?? string.Empty;
        var origins = spaOrigin.Split(",").Select(o => o.Trim()).ToArray();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("spa", policy =>
            {
                policy.WithOrigins(origins)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        var app = builder.Build();

        app.UseExceptionHandler();

        app.Map("/error", (HttpContext context) =>
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            return Results.Json(new { error = "Internal Server Error" });
        });

        app.UseCors("spa");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();
            db.Database.EnsureCreated();
            await DataSeeder.SeedAsync(db, passwordHasher);
        }

        app.Run();
    }
}
