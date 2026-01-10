using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using todo2.Auth;
using todo2.Database;
using todo2.Models.Db;

namespace todo2;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Logging.ClearProviders();
        builder.Logging.AddConsole();

        builder.Services.AddControllers();

        builder.Services.AddExceptionHandler(options =>
        {
            options.ExceptionHandlingPath = "/error";
        });
        builder.Services.AddProblemDetails();

        var keepAliveConnection = new SqliteConnection("Data Source=:memory:");
        keepAliveConnection.Open();

        builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

        builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
        builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

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

        builder.Services.AddSingleton(keepAliveConnection);

        builder.Services.AddDbContext<AppDbContext>((sp, opt) =>
        {
            var conn = sp.GetRequiredService<SqliteConnection>();
            opt.UseSqlite(conn);
        });

        var spaOrigin = builder.Configuration["Cors:SpaOrigin"];

        if (string.IsNullOrWhiteSpace(spaOrigin))
        {
            throw new InvalidOperationException("Missing configuration value: Cors:SpaOrigin");
        }

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("spa", policy =>
            {
                policy.WithOrigins(spaOrigin)
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
            db.Database.EnsureCreated();
        }

        app.Run();
    }
}
