using System;
using System.Collections.Generic;
using System.Threading;

namespace TasteFlow.Api.Infrastructure
{
    /// <summary>
    /// Armazena timings por request via AsyncLocal para publicar em Server-Timing
    /// sem depender de logs em stdout (que podem causar backpressure no Fly).
    /// </summary>
    public static class RequestTimings
    {
        private static readonly AsyncLocal<Dictionary<string, double>?> _data = new();

        public static void Reset()
        {
            _data.Value = new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase);
        }

        public static void Set(string name, double durationMs)
        {
            if (string.IsNullOrWhiteSpace(name))
                return;

            var dict = _data.Value;
            if (dict == null)
            {
                dict = new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase);
                _data.Value = dict;
            }

            // Se o mesmo timing for setado várias vezes no request, manter o maior (mais útil para diagnóstico)
            if (dict.TryGetValue(name, out var existing))
                dict[name] = Math.Max(existing, durationMs);
            else
                dict[name] = durationMs;
        }

        public static IReadOnlyDictionary<string, double> Snapshot()
        {
            return _data.Value ?? (IReadOnlyDictionary<string, double>)new Dictionary<string, double>();
        }
    }
}


