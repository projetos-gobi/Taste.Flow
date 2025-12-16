using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.IO.Compression;

namespace TasteFlow.Ioc
{
    public static class APIConfiguration
    {
        public static void UseCorsConfiguration(this IApplicationBuilder app)
        {
            app.UseCors("PolicyTasteFlow");
        }

        public static void AddCorsConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddCors(options =>
            {
                var origins = configuration.GetSection("AllowedHosts").Get<string[]>();

                options.AddPolicy("PolicyTasteFlow", builder => {
                    builder
                        .WithOrigins(origins)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
        }

        public static void AddDefaultConfiguration(this IServiceCollection services)
        {
            services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Fastest);
            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
            });
        }
    }
}
