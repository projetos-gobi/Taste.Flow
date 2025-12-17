using System;
using System.Collections.Generic;

namespace TasteFlow.Infrastructure.Services
{
    public static class NpgsqlConnectionStringNormalizer
    {
        /// <summary>
        /// Normaliza keywords que entram erradas via env/secret (ex.: "Min Pool Size"/"Max Pool Size")
        /// e quebram o parsing do Npgsql em runtime.
        /// </summary>
        public static string Normalize(string? connectionString)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
                return connectionString ?? string.Empty;

            var parts = connectionString.Split(';', StringSplitOptions.RemoveEmptyEntries);
            var kv = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            // Importante: manter ordem determinística para não "quebrar" pooling por variação textual da connection string.
            // (Pools são separados por string exata.)
            var orderedKeys = new List<string>(parts.Length);

            foreach (var raw in parts)
            {
                var part = raw?.Trim();
                if (string.IsNullOrEmpty(part))
                    continue;

                var eq = part.IndexOf('=');
                if (eq <= 0 || eq >= part.Length - 1)
                {
                    kv[part] = string.Empty;
                    continue;
                }

                var key = part.Substring(0, eq).Trim();
                var value = part.Substring(eq + 1).Trim();

                if (key.Equals("Min Pool Size", StringComparison.OrdinalIgnoreCase))
                    key = "Minimum Pool Size";
                else if (key.Equals("Max Pool Size", StringComparison.OrdinalIgnoreCase))
                    key = "Maximum Pool Size";

                if (!kv.ContainsKey(key))
                    orderedKeys.Add(key);

                kv[key] = value;
            }

            var normalized = new List<string>(orderedKeys.Count);
            foreach (var key in orderedKeys)
            {
                var value = kv[key];

                if (string.IsNullOrEmpty(value))
                    normalized.Add(key);
                else
                    normalized.Add($"{key}={value}");
            }

            return string.Join(';', normalized);
        }
    }
}


