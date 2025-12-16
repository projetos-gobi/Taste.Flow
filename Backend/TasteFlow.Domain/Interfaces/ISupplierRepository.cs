using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface ISupplierRepository : IRepository<Supplier>
    {
        Task<bool> CreateSupplierAsync(Supplier supplier);
        IQueryable<Supplier> GetSuppliersPaged(Guid enterpriseId);
        Task<Supplier> GetSupplierByIdAsync(Guid id, Guid enterpriseId);
        Task<Supplier> GetSupplierForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateSupplierAsync(Supplier supplier, Guid enterpriseId);
        Task<bool> SoftDeleteSupplierAsync(Guid supplierId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<Supplier>> GetAllSuppliersByEnterpriseIdAsync(Guid enterpriseId);
        Task<IEnumerable<Supplier>> GetExistingSuppliersAsync(string fantasyName, string cnpj, Guid enterpriseId);
        Task<bool> ExistsByAsync<T>(Expression<Func<Supplier, T>> selector, Guid id, Guid enterpriseId);
    }
}
