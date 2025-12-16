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
using TasteFlow.Shared.Extensions;

namespace TasteFlow.Infrastructure.Repositories
{
    public class UserPasswordManagementRepository : BaseRepository<UserPasswordManagement>, IUserPasswordManagementRepository
    {
        private readonly IEventLogger _eventLogger;

        public UserPasswordManagementRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
        }

        public async Task<UserPasswordManagement> ForgotPasswordAsync(Users user)
        {
            try
            {
                var userPasswordManagement = new UserPasswordManagement
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    Code = StringExtension.GenerateLicenseCode(10),
                    ExpirationDate = null,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = user.Id,
                    IsActive = true,
                    IsDeleted = false
                };

                Add(userPasswordManagement);

                await SaveChangesAsync();

                return userPasswordManagement;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante geração do token de redefinir senha UserId: {user.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<UserPasswordManagement> GetUserPasswordManagementByCodeAsync(string code)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Code == code && x.IsActive && !x.IsDeleted)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a consultar de um token de redefinir pelo código: {code}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<bool> UpdateUserPasswordManagementStatusAsync(UserPasswordManagement userPasswordManagement)
        {
            try
            {
                if (userPasswordManagement == null) 
                { 
                    return false;
                }

                userPasswordManagement.MustChangePassword = false;
                userPasswordManagement.IsActive = false;
                userPasswordManagement.IsDeleted = true;
                userPasswordManagement.LastPasswordChange = DateTime.Now;
                userPasswordManagement.ModifiedOn = DateTime.Now;

                Update(userPasswordManagement);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar o token de alteração de senha ID: {userPasswordManagement.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
