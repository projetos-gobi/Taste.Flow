using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<bool> CreateCategoriesRangeAsync(IEnumerable<Category> categories);
        IQueryable<Category> GetCategoriesPaged(Guid enterpriseId);
        Task<Category> GetCategoryByIdAsync(Guid id, Guid enterpriseId);
        Task<Category> GetCategoryForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateCategoryAsync(Category category, Guid enterpriseId);
        Task<bool> SoftDeleteCategoryAsync(Guid categoryId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<Category>> GetAllCategoriesByEnterpriseIdAsync(Guid enterpriseId);
        Task<IEnumerable<Category>> GetExistingCategoriesAsync(IEnumerable<string> categories, Guid enterpriseId);
        Task<bool> ExistsByAsync<T>(Expression<Func<Category, T>> selector, Guid id, Guid enterpriseId);
    }
}
