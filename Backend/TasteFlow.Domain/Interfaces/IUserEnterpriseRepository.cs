using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IUserEnterpriseRepository : IRepository<UserEnterprise>
    {
        Task<bool> CreateUserEnterpriseForUsersAsync(IEnumerable<Guid> users, IEnumerable<Guid> licenseManagementIds, Guid enterpriseId);
        Task<int> GetActiveLicensesCountByEnterpriseIdAsync(Guid enterpriseId);
    }
}
