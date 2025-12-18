using Microsoft.EntityFrameworkCore;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class UserRefreshTokenRepository : BaseRepository<UserRefreshToken>, IUserRefreshTokenRepository
    {
        private readonly IEventLogger _eventLogger;
        private readonly NpgsqlDataSource _dataSource;

        public UserRefreshTokenRepository(TasteFlowContext context, IEventLogger eventLogger, NpgsqlDataSource dataSource) : base(context)
        {
            _eventLogger = eventLogger;
            _dataSource = dataSource;
        }

        public async Task<UserRefreshToken> CreateUserRefreshTokenAsync(Guid userId)
        {
            try
            {
                var token = new UserRefreshToken
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    RefreshToken = Guid.NewGuid().ToString(),
                    ExpirationDate = DateTime.UtcNow.AddHours(3),
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = userId,
                    IsActive = true,
                    IsDeleted = false
                };

                await using var connection = await _dataSource.OpenConnectionAsync();
                await using var cmd = new NpgsqlCommand(@"
INSERT INTO ""UserRefreshToken""
(""Id"", ""UserId"", ""RefreshToken"", ""ExpirationDate"", ""CreatedOn"", ""CreatedBy"", ""IsActive"", ""IsDeleted"")
VALUES
(@id, @userId, @refreshToken, @expirationDate, @createdOn, @createdBy, @isActive, @isDeleted)", connection)
                {
                    CommandTimeout = 5
                };

                cmd.Parameters.AddWithValue("id", token.Id);
                cmd.Parameters.AddWithValue("userId", token.UserId);
                cmd.Parameters.AddWithValue("refreshToken", token.RefreshToken);
                cmd.Parameters.AddWithValue("expirationDate", token.ExpirationDate);
                cmd.Parameters.AddWithValue("createdOn", token.CreatedOn);
                cmd.Parameters.AddWithValue("createdBy", token.CreatedBy);
                cmd.Parameters.AddWithValue("isActive", token.IsActive);
                cmd.Parameters.AddWithValue("isDeleted", token.IsDeleted);

                await cmd.ExecuteNonQueryAsync();

                return token;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante geração do token de acesso: {userId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<UserRefreshToken> ForgotPasswordAsync(Users user)
        {
            try
            {
                var token = new UserRefreshToken
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    RefreshToken = Guid.NewGuid().ToString(), 
                    ExpirationDate = DateTime.UtcNow.AddMinutes(5),
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = user.Id, 
                    IsActive = true,
                    IsDeleted = false
                };

                await using var connection = await _dataSource.OpenConnectionAsync();
                await using var cmd = new NpgsqlCommand(@"
INSERT INTO ""UserRefreshToken""
(""Id"", ""UserId"", ""RefreshToken"", ""ExpirationDate"", ""CreatedOn"", ""CreatedBy"", ""IsActive"", ""IsDeleted"")
VALUES
(@id, @userId, @refreshToken, @expirationDate, @createdOn, @createdBy, @isActive, @isDeleted)", connection)
                {
                    CommandTimeout = 5
                };

                cmd.Parameters.AddWithValue("id", token.Id);
                cmd.Parameters.AddWithValue("userId", token.UserId);
                cmd.Parameters.AddWithValue("refreshToken", token.RefreshToken);
                cmd.Parameters.AddWithValue("expirationDate", token.ExpirationDate);
                cmd.Parameters.AddWithValue("createdOn", token.CreatedOn);
                cmd.Parameters.AddWithValue("createdBy", token.CreatedBy);
                cmd.Parameters.AddWithValue("isActive", token.IsActive);
                cmd.Parameters.AddWithValue("isDeleted", token.IsDeleted);

                await cmd.ExecuteNonQueryAsync();

                return token;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante geração do token de redefinir senha UserId: {user.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<UserRefreshToken> GetUserRefreshTokenByRefreshTokenAsync(Guid userId, string refreshToken)
        {
            try
            {
                var normalizedToken = (refreshToken ?? string.Empty).Trim().ToLowerInvariant();

                await using var connection = await _dataSource.OpenConnectionAsync();
                await using var cmd = new NpgsqlCommand(@"
SELECT
  rt.""Id"",
  rt.""UserId"",
  rt.""RefreshToken"",
  rt.""ExpirationDate"",
  rt.""CreatedOn"",
  rt.""IsActive"",
  rt.""IsDeleted"",
  u.""EmailAddress"",
  u.""MustChangePassword"",
  u.""AccessProfileId"",
  u.""Name"",
  (
    SELECT ue.""EnterpriseId""
    FROM ""UserEnterprise"" ue
    WHERE ue.""UserId"" = u.""Id"" AND ue.""IsActive"" AND NOT ue.""IsDeleted""
    LIMIT 1
  ) AS ""EnterpriseId""
FROM ""UserRefreshToken"" rt
JOIN ""Users"" u ON u.""Id"" = rt.""UserId""
WHERE rt.""UserId"" = @userId
  AND LOWER(rt.""RefreshToken"") = @refreshToken
  AND rt.""IsActive"" AND NOT rt.""IsDeleted""
ORDER BY rt.""CreatedOn"" DESC
LIMIT 1", connection)
                {
                    CommandTimeout = 5
                };

                cmd.Parameters.AddWithValue("userId", userId);
                cmd.Parameters.AddWithValue("refreshToken", normalizedToken);

                await using var reader = await cmd.ExecuteReaderAsync();
                if (!await reader.ReadAsync())
                    return null;

                var rt = new UserRefreshToken
                {
                    Id = reader.GetGuid(0),
                    UserId = reader.GetGuid(1),
                    RefreshToken = reader.GetString(2),
                    ExpirationDate = reader.GetDateTime(3),
                    CreatedOn = reader.GetDateTime(4),
                    IsActive = reader.GetBoolean(5),
                    IsDeleted = reader.GetBoolean(6),
                    User = new Users
                    {
                        Id = reader.GetGuid(1),
                        EmailAddress = reader.IsDBNull(7) ? "" : reader.GetString(7),
                        MustChangePassword = !reader.IsDBNull(8) && reader.GetBoolean(8),
                        AccessProfileId = reader.GetGuid(9),
                        Name = reader.IsDBNull(10) ? "" : reader.GetString(10),
                        UserEnterprises = new List<UserEnterprise>(),
                        UserPasswordManagements = new List<UserPasswordManagement>()
                    }
                };

                if (!reader.IsDBNull(11))
                {
                    rt.User.UserEnterprises.Add(new UserEnterprise
                    {
                        EnterpriseId = reader.GetGuid(11),
                        IsActive = true,
                        IsDeleted = false
                    });
                }

                return rt;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a consultar de um token de acesso RefreshToken: {refreshToken}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
