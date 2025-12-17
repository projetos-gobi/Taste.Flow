using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Npgsql;
using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using TasteFlow.Infrastructure.Services;

namespace TasteFlow.Api.Infrastructure
{
    /// <summary>
    /// Aquece a conexão com o Postgres no startup para reduzir latência do primeiro request
    /// (DNS/TLS/handshake/pool init), que no Fly + Supabase pode parecer "travar" no login/listagem.
    /// </summary>
    public sealed class DbWarmupHostedService : IHostedService
    {
        private readonly IConfiguration _configuration;

        public DbWarmupHostedService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                var connectionString = NpgsqlConnectionStringNormalizer.Normalize(
                    _configuration.GetConnectionString("DefaultConnection"));

                if (string.IsNullOrWhiteSpace(connectionString))
                {
                    Console.WriteLine("[WARMUP] DefaultConnection vazia. Warmup ignorado.");
                    return;
                }

                var swOpen = Stopwatch.StartNew();
                await using var connection = new NpgsqlConnection(connectionString);
                await connection.OpenAsync(cancellationToken);
                swOpen.Stop();

                await using var cmd = new NpgsqlCommand("SELECT 1", connection)
                {
                    CommandTimeout = 5
                };

                var swQuery = Stopwatch.StartNew();
                await cmd.ExecuteScalarAsync(cancellationToken);
                swQuery.Stop();

                Console.WriteLine($"[WARMUP] DB warmup OK: openMs={swOpen.ElapsedMilliseconds} queryMs={swQuery.ElapsedMilliseconds}");
            }
            catch (Exception ex)
            {
                // Nunca derrubar o serviço por causa do warmup: loga e segue.
                Console.WriteLine($"[WARMUP] DB warmup falhou: {ex.Message}");
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}


