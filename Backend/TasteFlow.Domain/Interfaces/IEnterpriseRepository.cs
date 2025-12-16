using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IEnterpriseRepository : IRepository<Enterprise>
    {
        Task<bool> CreateEnterpriseAsync(Enterprise enterprise);
        Task<bool> UpdateEnterpriseAsync(Enterprise enterprise);
        Task<bool> GetEnterpriseExistingAsync(Enterprise enterprise);
        Task<Enterprise> GetEnterpriseByIdAsync(Guid id);
        Task<Enterprise> GetEnterpriseDetailByIdAsync(Guid id);
        Task<Enterprise> GetEnterpriseForUpdateByIdAsync(Guid id);
        IQueryable<Enterprise> GetEnterprisesPaged();
        Task<bool> SoftDeleteEnterpriseAsync(Guid enterpriseId, Guid userId);
        Task<IEnumerable<Enterprise>> GetAllEnterprisesForUserRegistrationAsync();
        Task<Enterprise> GetEnterpriseByIdForCreateLicenseAsync(Guid id);
    }
}
