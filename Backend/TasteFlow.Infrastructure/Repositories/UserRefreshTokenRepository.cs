using Microsoft.EntityFrameworkCore;
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

        public UserRefreshTokenRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
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

                Add(token);

                await SaveChangesAsync();

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

                Add(token);

                await SaveChangesAsync();

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
                var result = await DbSet
                    .Where(x => x.UserId == userId && x.RefreshToken.ToLower() == refreshToken.ToLower() && x.IsActive && !x.IsDeleted)
                    .Select(x => new UserRefreshToken()
                    {
                        Id = x.Id,
                        UserId = x.UserId,
                        RefreshToken = x.RefreshToken,
                        ExpirationDate = x.ExpirationDate,
                        CreatedOn = x.CreatedOn,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        User = new Users()
                        {
                            Id = x.UserId,
                            EmailAddress = x.User.EmailAddress,
                            MustChangePassword = x.User.MustChangePassword,
                            AccessProfileId = x.User.AccessProfileId,
                            Name = x.User.Name,
                            UserEnterprises = x.User.UserEnterprises.Where(ue => ue.IsActive && !ue.IsDeleted).Select(ue => new UserEnterprise()
                            {
                                Id = ue.Id,
                                EnterpriseId = ue.EnterpriseId,
                                LicenseManagement = new LicenseManagement()
                                {
                                    Id = ue.LicenseManagement.Id,
                                    ExpirationDate = ue.LicenseManagement.ExpirationDate,
                                    IsIndefinite = ue.LicenseManagement.IsIndefinite,
                                    IsActive = ue.LicenseManagement.IsActive,
                                }
                            }).ToList(),
                        }
                    })
                    .OrderByDescending(x => x.CreatedOn)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                return result;
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
