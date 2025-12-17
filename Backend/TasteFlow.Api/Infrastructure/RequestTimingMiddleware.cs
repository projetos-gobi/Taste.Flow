using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
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
            RequestTimings.Reset();
            var sw = Stopwatch.StartNew();
            var traceId = context.TraceIdentifier;

            // Garante que o header entra mesmo se ocorrer exceção depois.
            context.Response.OnStarting(() =>
            {
                sw.Stop();
                var elapsedMs = sw.Elapsed.TotalMilliseconds;

                context.Response.Headers["X-Request-Id"] = traceId;
                var timings = RequestTimings.Snapshot();
                if (timings.Count == 0)
                {
                    context.Response.Headers["Server-Timing"] = $"app;dur={elapsedMs:0.##}";
                }
                else
                {
                    // app sempre primeiro
                    var parts = new List<string>(timings.Count + 1) { $"app;dur={elapsedMs:0.##}" };
                    foreach (var kv in timings)
                    {
                        // evitar chaves muito longas ou com espaços
                        var name = kv.Key.Replace(' ', '_');
                        parts.Add($"{name};dur={kv.Value:0.##}");
                    }
                    context.Response.Headers["Server-Timing"] = string.Join(", ", parts);
                }

                return Task.CompletedTask;
            });

            try
            {
                await _next(context);
            }
            finally
            {
                // Intencionalmente sem Console.WriteLine aqui:
                // logs em stdout podem gerar backpressure no Fly e degradar latência.
                // O diagnóstico principal fica via header Server-Timing + X-Request-Id.
                sw.Stop();
            }
        }
    }
}


