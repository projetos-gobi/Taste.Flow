using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IProductTypeRepository : IRepository<ProductType>
    {
        Task<bool> CreateProductTypesRangeAsync(IEnumerable<ProductType> productTypes);
        IQueryable<ProductType> GetProductTypesPaged(Guid enterpriseId);
        Task<ProductType> GetProductTypeByIdAsync(Guid id, Guid enterpriseId);
        Task<ProductType> GetProductTypeForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateProductTypeAsync(ProductType productType, Guid enterpriseId);
        Task<bool> SoftDeleteProductTypeAsync(Guid productTypeId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<ProductType>> GetAllProductTypesByEnterpriseIdAsync(Guid enterpriseId);
        Task<IEnumerable<ProductType>> GetExistingProductTypesAsync(IEnumerable<string> productTypes, Guid enterpriseId);
    }
}
