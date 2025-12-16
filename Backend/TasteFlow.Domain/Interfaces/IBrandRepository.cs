using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IBrandRepository : IRepository<Brand>
    {
        Task<bool> CreateBrandsRangeAsync(IEnumerable<Brand> brands);
        IQueryable<Brand> GetBrandsPaged(Guid enterpriseId);
        Task<Brand> GetBrandByIdAsync(Guid id, Guid enterpriseId);
        Task<Brand> GetBrandForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateBrandAsync(Brand brand, Guid enterpriseId);
        Task<bool> SoftDeleteBrandAsync(Guid brandId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<Brand>> GetAllBrandsByEnterpriseIdAsync(Guid enterpriseId);
        Task<IEnumerable<Brand>> GetExistingBrandsAsync(IEnumerable<string> brands, Guid enterpriseId);
    }
}
