using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IMerchandiseRepository : IRepository<Merchandise>
    {
        Task<bool> CreateMerchandisesRangeAsync(IEnumerable<Merchandise> merchandises);
        IQueryable<Merchandise> GetMerchandisesPaged(Guid enterpriseId);
        Task<Merchandise> GetMerchandiseByIdAsync(Guid id, Guid enterpriseId);
        Task<Merchandise> GetMerchandiseForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateMerchandiseAsync(Merchandise merchandise, Guid enterpriseId);
        Task<bool> SoftDeleteMerchandiseAsync(Guid merchandiseId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<Merchandise>> GetAllMerchandisesByEnterpriseIdAsync(Guid enterpriseId);
        Task<bool> ExistsByAsync<T>(Expression<Func<Merchandise, T>> selector, Guid id, Guid enterpriseId);
    }
}
