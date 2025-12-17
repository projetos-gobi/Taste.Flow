using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Repositories.Base;
using TasteFlow.Shared.Extensions;

namespace TasteFlow.Infrastructure.Repositories
{
    public class UsersRepository : BaseRepository<Users>, IUsersRepository
    {
        private readonly IEventLogger _eventLogger;
        private readonly TasteFlowContext _context;
        private readonly string _connectionString;

        public UsersRepository(TasteFlowContext context, IEventLogger eventLogger, IConfiguration configuration) : base(context)
        {
            _eventLogger = eventLogger;
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<Guid>> CreateUsersRangeAsync(IEnumerable<Users> users)
        {
            try
            {
                users.ToList().ForEach(x =>
                {
                    x.PasswordSalt = Guid.NewGuid().ToString();
                    x.PasswordHash = x.PasswordHash?.ToSha256Hash(x.PasswordSalt);
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                AddRange(users);

                var result = await SaveChangesAsync();

                return users.Select(x => x.Id);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar os usuários no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Guid>();
            }
        }

        public async Task<Users> GetAuthenticatedAccountAsync(string email, string password)
        {
            try
            {
                Console.WriteLine($"[AUTH] Using ADO.NET for login: {email}");
                
                using (var connection = new Npgsql.NpgsqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    Console.WriteLine($"[AUTH] Connection opened!");

                    // Buscar usuário
                    var command = new Npgsql.NpgsqlCommand(
                        @"SELECT ""Id"", ""EmailAddress"", ""PasswordHash"", ""PasswordSalt"", ""Name"", ""AccessProfileId"", ""MustChangePassword""
                          FROM ""Users"" 
                          WHERE ""EmailAddress"" = @email AND ""IsActive"" AND NOT ""IsDeleted""
                          LIMIT 1", 
                        connection);
                    
                    command.Parameters.AddWithValue("email", email);
                    command.CommandTimeout = 30;

                    Users user = null;
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            user = new Users
                            {
                                Id = reader.GetGuid(0),
                                EmailAddress = reader.GetString(1),
                                PasswordHash = reader.GetString(2),
                                PasswordSalt = reader.GetString(3),
                                Name = reader.GetString(4),
                                AccessProfileId = reader.GetGuid(5),
                                MustChangePassword = reader.GetBoolean(6),
                                UserEnterprises = new List<UserEnterprise>(),
                                UserPasswordManagements = new List<UserPasswordManagement>()
                            };
                        }
                    }

                    Console.WriteLine($"[AUTH] User found: {user != null}");
                    return user;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AUTH ERROR] {ex.Message}");
                var message = $"Ocorreu um erro durante a busca de um usuário no banco de dados: E-mail: {email}";
                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<Users> GetUserByEmailAsync(string email)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.EmailAddress == email && x.IsActive && !x.IsDeleted)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a busca de um usuário pelo e-mail: {email}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<Users> GetUserByIdAsync(Guid id)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && !x.IsDeleted)
                    .Select(x => new Users()
                    {
                        Id = x.Id,
                        AccessProfileId = x.AccessProfileId,
                        Name = x.Name,
                        EmailAddress = x.EmailAddress,
                        PasswordSalt = x.PasswordSalt,
                        PasswordHash = x.PasswordHash,
                        Contact = x.Contact,
                        CreatedOn = x.CreatedOn,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        AccessProfile = new AccessProfile()
                        {
                            Id = x.AccessProfileId,
                            Name = x.AccessProfile.Name
                        },
                        UserEnterprises = x.UserEnterprises.Select(ue => new UserEnterprise()
                        {
                            Id = ue.Id,
                            LicenseManagement = new LicenseManagement()
                            {
                                Id = ue.LicenseManagement.Id,
                                License = new License()
                                {
                                    Id = ue.LicenseManagement.License.Id,
                                    Name = ue.LicenseManagement.License.Name
                                }
                            },
                            Enterprise = new Enterprise()
                            {
                                Id = ue.Enterprise.Id,
                                FantasyName = ue.Enterprise.FantasyName,
                                SocialReason = ue.Enterprise.SocialReason
                            }
                        }).ToList()
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um usuário pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);
                return null;
            }
        }

        public async Task<Users> GetUserForUpdateByIdAsync(Guid id)
        {
            try
            {
                var result = await DbSet
                    .Include(x => x.UserEnterprises)
                    .Where(x => x.Id == id && !x.IsDeleted)
                    .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de uma usuário pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public IQueryable<Users> GetUsersPaged()
        {
            // BYPASS Entity Framework - usar FromSqlInterpolated para evitar travamento
            var sql = $@"SELECT * FROM ""Users"" WHERE NOT ""IsDeleted""";
            
            return DbSet.FromSqlRaw(sql).AsNoTracking();
        }

        public async Task<(List<Users> users, int totalCount)> GetUsersPagedWithCountDirectAsync(int page, int pageSize, object filter = null)
        {
            var users = new List<Users>();
            int totalCount = 0;

            try
            {
                Console.WriteLine($"[REPO] Starting GetUsersPagedWithCountDirectAsync - page: {page}, pageSize: {pageSize}");

                // USAR MESMA CONEXÃO para COUNT e SELECT - evita problemas de concorrência
                using (var connection = new Npgsql.NpgsqlConnection(_connectionString))
                {
                    Console.WriteLine($"[REPO] Opening connection...");
                    await connection.OpenAsync();
                    Console.WriteLine($"[REPO] Connection opened!");

                    // PRIMEIRO: Fazer COUNT na mesma conexão
                    Console.WriteLine($"[REPO] Executing COUNT...");
                    var countSql = @"SELECT COUNT(*) FROM ""Users"" WHERE NOT ""IsDeleted""";
                    var countCommand = new Npgsql.NpgsqlCommand(countSql, connection);
                    countCommand.CommandTimeout = 30;
                    totalCount = Convert.ToInt32(await countCommand.ExecuteScalarAsync());
                    Console.WriteLine($"[REPO] Total count: {totalCount}");

                    // SEGUNDO: Fazer SELECT na mesma conexão
                    var offset = (page - 1) * pageSize;
                    var selectSql = @"
                        SELECT ""Id"", ""Name"", ""EmailAddress"" 
                        FROM ""Users"" 
                        WHERE NOT ""IsDeleted"" 
                        ORDER BY ""Name"" 
                        LIMIT @pageSize OFFSET @offset";

                    Console.WriteLine($"[REPO] Executing SELECT...");
                    var selectCommand = new Npgsql.NpgsqlCommand(selectSql, connection);
                    selectCommand.Parameters.AddWithValue("pageSize", pageSize);
                    selectCommand.Parameters.AddWithValue("offset", offset);
                    selectCommand.CommandTimeout = 30;

                    using (var reader = await selectCommand.ExecuteReaderAsync())
                    {
                        Console.WriteLine($"[REPO] Reading results...");
                        while (await reader.ReadAsync())
                        {
                            users.Add(new Users
                            {
                                Id = reader.GetGuid(0),
                                Name = reader.GetString(1),
                                EmailAddress = reader.GetString(2)
                            });
                        }
                    }
                    Console.WriteLine($"[REPO] Found {users.Count} users!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[REPO ERROR] {ex.Message}");
                Console.WriteLine($"[REPO ERROR] Stack: {ex.StackTrace}");
                throw;
            }

            return (users, totalCount);
        }

        // Método mantido para compatibilidade - delega para o novo método
        public async Task<List<Users>> GetUsersPagedDirectAsync(int page, int pageSize, object filter = null)
        {
            var (users, _) = await GetUsersPagedWithCountDirectAsync(page, pageSize, filter);
            return users;
        }

        public async Task<bool> RecoverPasswordAsync(UserPasswordManagement userPasswordManagement, string newPassword)
        {
            try
            {
                var currentUser = await GetByIdAsync(userPasswordManagement.UserId);

                if(currentUser != null)
                {
                    currentUser.PasswordHash = newPassword.ToSha256Hash(currentUser.PasswordSalt);
                    currentUser.ModifiedOn = DateTime.Now;
                    currentUser.MustChangePassword = true;
                    //currentUser.ModifiedBy = Guid.Parse("D87035A3-520E-4928-B25F-31FBBFF71A50");

                    Update(currentUser);

                    var result = await SaveChangesAsync();

                    return (result > 0);
                }

                return false;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a alteração de senha de um usuário UserId: {userPasswordManagement.UserId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> SoftDeleteUserAsync(Guid userId, Guid DeletedById)
        {
            try
            {
                var user = await GetUserForUpdateByIdAsync(userId);

                if (user == null)
                    return false;

                user.IsDeleted = true;
                user.IsActive = false;
                user.DeletedOn = DateTime.Now.ToUniversalTime();
                user.DeletedBy = DeletedById;

                foreach (var userEnterprise in user.UserEnterprises)
                {
                    userEnterprise.IsDeleted = true;
                    userEnterprise.IsActive = false;
                    userEnterprise.DeletedOn = DateTime.UtcNow;
                    //userEnterprise.DeletedBy = DeletedById;
                    userEnterprise.LicenseManagementId = null;
                }

                Update(user);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar uma usuário: {userId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateUserAsync(Users user)
        {
            try
            {
                var currentUser = await GetUserForUpdateByIdAsync(user.Id);

                if (currentUser == null)
                    return false;

                currentUser.AccessProfileId = user.AccessProfileId;
                currentUser.Name = user.Name;
                currentUser.EmailAddress = user.EmailAddress;
                currentUser.Contact = user.Contact;
                currentUser.IsActive = user.IsActive;

                Update(currentUser);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar um usuário: {user.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateUserPasswordAsync(UserPasswordManagement userPasswordManagement, string newPassword)
        {
            try
            {
                var currentUser = await GetByIdAsync(userPasswordManagement.UserId);

                if (currentUser != null)
                {
                    currentUser.PasswordHash = newPassword.ToSha256Hash(currentUser.PasswordSalt);
                    currentUser.ModifiedOn = DateTime.Now;
                    currentUser.MustChangePassword = false;
                    //currentUser.ModifiedBy = Guid.Parse("D87035A3-520E-4928-B25F-31FBBFF71A50");

                    Update(currentUser);

                    var result = await SaveChangesAsync();

                    return (result > 0);
                }

                return false;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a alteração de senha de um usuário UserId: {userPasswordManagement.UserId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
