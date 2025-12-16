using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class UserEnterpriseRepository : BaseRepository<UserEnterprise>, IUserEnterpriseRepository
    {
        public UserEnterpriseRepository(TasteFlowContext context) : base(context)
        {
        }

        public async Task<bool> CreateUserEnterpriseForUsersAsync(IEnumerable<Guid> users, IEnumerable<Guid> licenseManagementIds, Guid enterpriseId)
        {
            try
            {
                var userList = users.ToList();

                var licenseList = licenseManagementIds.ToList();

                if (userList.Count != licenseList.Count)
                    return false;

                var userEnterprises = new List<UserEnterprise>();

                for (int i = 0; i < userList.Count; i++)
                {
                    var userEnterprise = new UserEnterprise
                    {
                        Id = Guid.NewGuid(),
                        UserId = userList[i],
                        EnterpriseId = enterpriseId,
                        LicenseManagementId = licenseList[i],
                        ProfileTypeId = null,
                        CreatedOn = DateTime.Now.ToUniversalTime(),
                        CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c"),
                        IsActive = true
                    };

                    userEnterprises.Add(userEnterprise);
                }

                AddRange(userEnterprises);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro as associar de empresa e usuários no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<int> GetActiveLicensesCountByEnterpriseIdAsync(Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .CountAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro as associar de empresa e usuários no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return 1;
            }
        }
    }
}
