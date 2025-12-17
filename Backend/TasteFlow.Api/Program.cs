using AutoMapper;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.OpenApi.Models;
using System.IO.Compression;
using TasteFlow.Api.Infrastructure;
using TasteFlow.Api.Mapping;
using TasteFlow.Application.Startup;
using TasteFlow.Infrastructure.Startup;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

ConfigureServices(builder);

UseSwaggerConfiguration(builder);
AddCorsConfiguration(builder.Services, builder.Configuration);
AddDefaultConfiguration(builder.Services);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseResponseCompression();

// Tempo total por request + Server-Timing (diagnóstico de performance end-to-end)
app.UseMiddleware<RequestTimingMiddleware>();

app.UseCors("PolicyTasteFlow");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

void ConfigureServices(WebApplicationBuilder builder)
{
    builder.Services.AddMemoryCache();
    builder.Services.AddInfrastructure(builder.Configuration);
    builder.Services.AddHostedService<DbWarmupHostedService>();
    builder.Services.AddApplication();
    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        });

    builder.Services.AddMediatR(cfg => { cfg.RegisterServicesFromAssemblies(typeof(Program).Assembly); });

    builder.Services.AddAntiforgery(x =>
    {
        x.SuppressXFrameOptionsHeader = true;
    });

    builder.Services.AddAutoMapper(cfg =>
    {
        cfg.AddProfile<MappingProfile>();
        cfg.AddProfile<TasteFlow.Application.Mapping.MappingProfile>();
    });
}

void UseSwaggerConfiguration(WebApplicationBuilder builder)
{
    builder.Services.AddSwaggerGen(options =>
    {
        options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
        {
            Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",
            In = ParameterLocation.Header,
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "oauth2"
                    }
                },
                new string[] { }
            }
        });
    });
}

void AddCorsConfiguration(IServiceCollection services, IConfiguration configuration)
{
    var origins = configuration.GetSection("AllowedHosts").Get<string[]>();

    services.AddCors(options =>
    {
        options.AddPolicy("PolicyTasteFlow", builder =>
        {
            builder
                .WithOrigins(origins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });
}

void AddDefaultConfiguration(IServiceCollection services)
{
    services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Fastest);

    services.AddResponseCompression(options =>
    {
        options.EnableForHttps = true;
        options.Providers.Add<GzipCompressionProvider>();
    });
}
