using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Repositories.Base;
using TasteFlow.Infrastructure.Services;
using TasteFlow.Shared.Extensions;

namespace TasteFlow.Infrastructure.Repositories
{
    public class UsersRepository : BaseRepository<Users>, IUsersRepository
    {
        private readonly IEventLogger _eventLogger;
        private readonly TasteFlowContext _context;
        private readonly NpgsqlDataSource _dataSource;

        public UsersRepository(TasteFlowContext context, IEventLogger eventLogger, NpgsqlDataSource dataSource) : base(context)
        {
            _eventLogger = eventLogger;
            _context = context;
            _dataSource = dataSource;
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
            const int maxRetries = 2;
            var delayMs = 100;

            Exception lastEx = null;

            for (var attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    var swOpen = Stopwatch.StartNew();
                    await using var connection = await _dataSource.OpenConnectionAsync();
                    swOpen.Stop();
                    System.Diagnostics.Activity.Current?.SetTag("tf_auth_dbopen", swOpen.Elapsed.TotalMilliseconds);

                    await using var command = new NpgsqlCommand(
                        @"SELECT ""Id"", ""EmailAddress"", ""PasswordHash"", ""PasswordSalt"", ""Name"", ""AccessProfileId"", ""MustChangePassword""
                          FROM ""Users"" 
                          WHERE ""EmailAddress"" = @email AND ""IsActive"" AND NOT ""IsDeleted""
                          LIMIT 1",
                        connection);

                    command.Parameters.AddWithValue("email", email);
                    command.CommandTimeout = 15;

                    Users user = null;
                    var swQuery = Stopwatch.StartNew();
                    await using (var reader = await command.ExecuteReaderAsync())
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
                    swQuery.Stop();
                    System.Diagnostics.Activity.Current?.SetTag("tf_auth_dbquery", swQuery.Elapsed.TotalMilliseconds);

                    if (user == null)
                    {
                        return null;
                    }

                    user.UserEnterprises = new List<UserEnterprise>();
                    return user;
                }
                catch (Exception ex) when (attempt < maxRetries && IsTransientDbException(ex))
                {
                    lastEx = ex;
                    await Task.Delay(delayMs);
                    delayMs *= 2;
                }
                catch (Exception ex)
                {
                    lastEx = ex;
                    break;
                }
            }

            throw lastEx ?? new Exception("Falha ao autenticar usuário (erro desconhecido).");
        }

        private static bool IsTransientDbException(Exception ex)
        {
            if (ex == null) return false;

            // Preferir sinalização do próprio driver
            if (ex is Npgsql.NpgsqlException npgEx)
                return npgEx.IsTransient;

            if (ex is TimeoutException)
                return true;

            if (ex is IOException)
                return true;

            if (ex is SocketException)
                return true;

            var msg = (ex.Message ?? string.Empty).ToLowerInvariant();
            return msg.Contains("timeout")
                || msg.Contains("exception while reading from stream")
                || msg.Contains("connection reset")
                || msg.Contains("broken pipe")
                || msg.Contains("connection refused");
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
                // USAR MESMA CONEXÃO para COUNT e SELECT - evita problemas de concorrência
                await using (var connection = await _dataSource.OpenConnectionAsync())
                {
                    // PRIMEIRO: Fazer COUNT na mesma conexão
                    var countSql = @"SELECT COUNT(*) FROM ""Users"" WHERE NOT ""IsDeleted""";
                    var countCommand = new NpgsqlCommand(countSql, connection);
                    countCommand.CommandTimeout = 30;
                    totalCount = Convert.ToInt32(await countCommand.ExecuteScalarAsync());

                    // SEGUNDO: Fazer SELECT na mesma conexão - QUERY ULTRA SIMPLES para testar
                    var offset = (page - 1) * pageSize;
                    // REMOVER ORDER BY e simplificar ao máximo
                    var selectSql = @"
                        SELECT ""Id"", ""Name"", ""EmailAddress"" 
                        FROM ""Users"" 
                        WHERE NOT ""IsDeleted"" 
                        LIMIT @pageSize OFFSET @offset";

                    var selectCommand = new NpgsqlCommand(selectSql, connection);
                    selectCommand.Parameters.AddWithValue("pageSize", pageSize);
                    selectCommand.Parameters.AddWithValue("offset", offset);
                    selectCommand.CommandTimeout = 10; // Reduzir timeout para falhar mais rápido se houver problema

                    await using (var reader = await selectCommand.ExecuteReaderAsync())
                    {
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
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return (users, totalCount);
        }

        // Método SEM COUNT - apenas SELECT rápido com retry logic
        public async Task<List<Users>> GetUsersPagedDirectAsync(int page, int pageSize, object filter = null)
        {
            var users = new List<Users>();
            const int maxRetries = 2;
            var retryCount = 0;
            var delayMs = 100;

            while (retryCount < maxRetries)
            {
                try
                {
                    users.Clear();
                    var swOpen = Stopwatch.StartNew();
                    await using (var connection = await _dataSource.OpenConnectionAsync())
                    {
                        swOpen.Stop();
                        System.Diagnostics.Activity.Current?.SetTag("tf_users_dbopen", swOpen.Elapsed.TotalMilliseconds);
                        // APENAS SELECT - SEM COUNT
                        var offset = (page - 1) * pageSize;
                        var selectSql = @"
                            SELECT ""Id"", ""Name"", ""EmailAddress"", ""AccessProfileId"", ""IsActive"" 
                            FROM ""Users"" 
                            WHERE NOT ""IsDeleted"" 
                            LIMIT @pageSize OFFSET @offset";

                        var selectCommand = new NpgsqlCommand(selectSql, connection);
                        selectCommand.Parameters.AddWithValue("pageSize", pageSize);
                        selectCommand.Parameters.AddWithValue("offset", offset);
                        selectCommand.CommandTimeout = 15;

                        var swQuery = Stopwatch.StartNew();
                        await using (var reader = await selectCommand.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                users.Add(new Users
                                {
                                    Id = reader.GetGuid(0),
                                    Name = reader.GetString(1),
                                    EmailAddress = reader.GetString(2),
                                    AccessProfileId = reader.GetGuid(3),
                                    IsActive = reader.GetBoolean(4)
                                });
                            }
                        }
                        swQuery.Stop();
                        System.Diagnostics.Activity.Current?.SetTag("tf_users_dbquery", swQuery.Elapsed.TotalMilliseconds);
                        return users; // Sucesso - retornar
                    }
                }
                catch (Exception ex)
                {
                    retryCount++;
                    
                    if (retryCount >= maxRetries)
                    {
                        return users; // Retornar lista vazia ao invés de throw
                    }
                    
                    if (!IsTransientDbException(ex))
                        return users;

                    await Task.Delay(delayMs);
                    delayMs *= 2;
                }
            }

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
