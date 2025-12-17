using Microsoft.AspNetCore.Mvc;
using Npgsql;
using TasteFlow.Infrastructure.Services;

namespace TasteFlow.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TestController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("test-direct-sql")]
        public async Task<IActionResult> TestDirectSql()
        {
            try
            {
                Console.WriteLine("[TEST] Starting direct SQL test...");
                
                var connectionString = NpgsqlConnectionStringNormalizer.Normalize(_configuration.GetConnectionString("DefaultConnection"));
                Console.WriteLine($"[TEST] Connection string: {connectionString}");

                var users = new List<object>();

                using (var connection = new NpgsqlConnection(connectionString))
                {
                    Console.WriteLine("[TEST] Opening connection...");
                    await connection.OpenAsync();
                    Console.WriteLine("[TEST] Connection opened!");

                    var command = new NpgsqlCommand("SELECT \"Id\", \"Name\", \"EmailAddress\" FROM \"Users\" WHERE NOT \"IsDeleted\" LIMIT 10", connection);
                    command.CommandTimeout = 30;

                    Console.WriteLine("[TEST] Executing query...");
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        Console.WriteLine("[TEST] Reading results...");
                        while (await reader.ReadAsync())
                        {
                            users.Add(new
                            {
                                Id = reader.GetGuid(0),
                                Name = reader.GetString(1),
                                EmailAddress = reader.GetString(2)
                            });
                        }
                    }
                    Console.WriteLine($"[TEST] Found {users.Count} users!");
                }

                return Ok(new { success = true, users, count = users.Count });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[TEST ERROR] {ex.Message}");
                Console.WriteLine($"[TEST ERROR] Stack: {ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message, stack = ex.StackTrace });
            }
        }
    }
}

