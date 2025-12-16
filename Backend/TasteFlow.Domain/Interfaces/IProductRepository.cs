using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<bool> CreateProductAsync(Product product);
        IQueryable<Product> GetProductsPaged(Guid enterpriseId);
        Task<Product> GetProductByIdAsync(Guid id, Guid enterpriseId);
        Task<Product> GetProductForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateProductAsync(Product product, Guid enterpriseId);
        Task<bool> SoftDeleteProductAsync(Guid productId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<Product>> GetAllProductsBySearchTermAsync(Guid enterpriseId, string searchTerm);
    }
}
