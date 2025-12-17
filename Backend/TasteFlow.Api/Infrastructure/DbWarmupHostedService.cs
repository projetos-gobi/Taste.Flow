using Microsoft.Extensions.Hosting;
using Npgsql;
using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace TasteFlow.Api.Infrastructure
{
    /// <summary>
    /// Aquece a conexão com o Postgres no startup para reduzir latência do primeiro request
    /// (DNS/TLS/handshake/pool init), que no Fly + Supabase pode parecer "travar" no login/listagem.
    /// </summary>
    public sealed class DbWarmupHostedService : BackgroundService
    {
        private readonly NpgsqlDataSource _dataSource;

        public DbWarmupHostedService(NpgsqlDataSource dataSource)
        {
            _dataSource = dataSource;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Warmup imediato + ping periódico para manter pelo menos 1 conexão ativa (reduz openMs em requests).
            await WarmupOnce(stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(TimeSpan.FromMinutes(2), stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    break;
                }

                await WarmupOnce(stoppingToken);
            }
        }

        private async Task WarmupOnce(CancellationToken cancellationToken)
        {
            try
            {
                var swOpen = Stopwatch.StartNew();
                await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
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
    }
}


