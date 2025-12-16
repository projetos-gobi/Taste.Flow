using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IProductIntermediateRepository : IRepository<ProductIntermediate>
    {
        Task<bool> CreateProductIntermediateAsync(ProductIntermediate productIntermediate);
        IQueryable<ProductIntermediate> GetProductIntermediatesPaged(Guid enterpriseId);
        Task<ProductIntermediate> GetProductIntermediateByIdAsync(Guid id, Guid enterpriseId);
        Task<ProductIntermediate> GetProductIntermediateForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateProductIntermediateAsync(ProductIntermediate productIntermediate, Guid enterpriseId);
        Task<bool> SoftDeleteProductIntermediateAsync(Guid productIntermediateId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<ProductIntermediate>> GetAllProductIntermediatesByEnterpriseIdAsync(Guid enterpriseId);
        Task<bool> ExistsByAsync<T>(Expression<Func<ProductIntermediate, T>> selector, Guid id, Guid enterpriseId);
    }
}
