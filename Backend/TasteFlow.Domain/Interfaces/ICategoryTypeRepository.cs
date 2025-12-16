using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface ICategoryTypeRepository : IRepository<CategoryType>
    {
        Task<bool> CreateCategoryTypesRangeAsync(IEnumerable<CategoryType> categoryTypes);
        IQueryable<CategoryType> GetCategoryTypesPaged(Guid enterpriseId);
        Task<CategoryType> GetCategoryTypeByIdAsync(Guid id, Guid enterpriseId);
        Task<CategoryType> GetCategoryTypeForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateCategoryTypeAsync(CategoryType categoryType, Guid enterpriseId);
        Task<bool> SoftDeleteCategoryTypeAsync(Guid categoryTypeId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<CategoryType>> GetAllCategoryTypesByEnterpriseIdAsync(Guid enterpriseId);
        Task<IEnumerable<CategoryType>> GetExistingCategoryTypesAsync(IEnumerable<string> categoryTypes, Guid enterpriseId);
    }
}
