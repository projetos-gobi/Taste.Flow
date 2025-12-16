using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IUnitRepository : IRepository<Unit>
    {
        Task<bool> CreateUnitsRangeAsync(IEnumerable<Unit> units);
        IQueryable<Unit> GetUnitsPaged(Guid enterpriseId);
        Task<Unit> GetUnitByIdAsync(Guid id, Guid enterpriseId);
        Task<Unit> GetUnitForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateUnitAsync(Unit unit, Guid enterpriseId);
        Task<bool> SoftDeleteUnitAsync(Guid unitId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<Unit>> GetAllUnitsByEnterpriseIdAsync(Guid enterpriseId);
        Task<IEnumerable<Unit>> GetExistingUnitsAsync(IEnumerable<string> units, Guid enterpriseId);
    }
}
