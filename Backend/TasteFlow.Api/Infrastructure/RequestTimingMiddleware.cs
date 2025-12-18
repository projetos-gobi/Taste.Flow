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
            // Usar Activity para propagar timings sem criar dependência cruzada (Api -> Application/Infrastructure).
            // Não rely em stdout (Fly pode ter backpressure).
            using var activity = new Activity("TasteFlow.Request");
            activity.Start();

            var sw = Stopwatch.StartNew();
            var traceId = context.TraceIdentifier;

            // Garante que o header entra mesmo se ocorrer exceção depois.
            context.Response.OnStarting(() =>
            {
                sw.Stop();
                var elapsedMs = sw.Elapsed.TotalMilliseconds;

                context.Response.Headers["X-Request-Id"] = traceId;
                var parts = new List<string> { $"app;dur={elapsedMs:0.##}" };

                // Exporta tags numéricas da Activity como Server-Timing.
                // Padrão: tags com prefixo "tf_" (ex.: tf_auth_mediator) e valor em ms.
                foreach (var tag in activity.TagObjects)
                {
                    if (tag.Key == null || !tag.Key.StartsWith("tf_", StringComparison.OrdinalIgnoreCase))
                        continue;

                    var name = tag.Key.Substring(3); // remove "tf_"

                    if (tag.Value is double d)
                        parts.Add($"{name};dur={d:0.##}");
                    else if (tag.Value is float f)
                        parts.Add($"{name};dur={f:0.##}");
                    else if (tag.Value is long l)
                        parts.Add($"{name};dur={l:0.##}");
                    else if (tag.Value is int i)
                        parts.Add($"{name};dur={i:0.##}");
                    else if (tag.Value is string s && double.TryParse(s, out var parsed))
                        parts.Add($"{name};dur={parsed:0.##}");
                }

                var timing = string.Join(", ", parts);

                // Em chamadas diretas ao Fly, o browser vê "Server-Timing" normalmente.
                // Mas quando passamos via proxy/rewrite da Vercel, ela pode não repassar o header "Server-Timing".
                // Duplicamos em um header customizado para manter observabilidade end-to-end.
                context.Response.Headers["Server-Timing"] = timing;
                context.Response.Headers["X-TF-Server-Timing"] = timing;

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
                activity.Stop();
            }
        }
    }
}


