using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface ISubCategoryRepository : IRepository<SubCategory>
    {
        Task<bool> CreateSubCategoriesRangeAsync(IEnumerable<SubCategory> subCategories);
        IQueryable<SubCategory> GetSubCategoriesPaged(Guid enterpriseId);
        Task<SubCategory> GetSubCategoryByIdAsync(Guid id, Guid enterpriseId);
        Task<SubCategory> GetSubCategoryForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateSubCategoryAsync(SubCategory subCategory, Guid enterpriseId);
        Task<bool> SoftDeleteSubCategoryAsync(Guid subCategoryId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<SubCategory>> GetAllSubCategoriesByEnterpriseIdAsync(Guid enterpriseId);
        Task<IEnumerable<SubCategory>> GetExistingSubCategoriesAsync(IEnumerable<string> subCategories, Guid enterpriseId);
    }
}
