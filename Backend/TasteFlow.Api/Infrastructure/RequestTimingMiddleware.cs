using Microsoft.AspNetCore.Http;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace TasteFlow.Api.Infrastructure
{
    /// <summary>
    /// Instrumentação leve de tempo total por request para diagnosticar latência end-to-end.
    /// Adiciona Server-Timing e loga no console.
    /// </summary>
    public sealed class RequestTimingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestTimingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var sw = Stopwatch.StartNew();
            var traceId = context.TraceIdentifier;

            // Garante que o header entra mesmo se ocorrer exceção depois.
            context.Response.OnStarting(() =>
            {
                sw.Stop();
                var elapsedMs = sw.Elapsed.TotalMilliseconds;

                context.Response.Headers["X-Request-Id"] = traceId;
                context.Response.Headers["Server-Timing"] = $"app;dur={elapsedMs:0.##}";

                return Task.CompletedTask;
            });

            try
            {
                await _next(context);
            }
            finally
            {
                // Log final (mesmo em erro) para correlação com o traceId.
                sw.Stop();
                Console.WriteLine($"[REQ] {context.Request.Method} {context.Request.Path} status={context.Response.StatusCode} elapsedMs={sw.ElapsedMilliseconds} traceId={traceId}");
            }
        }
    }
}


