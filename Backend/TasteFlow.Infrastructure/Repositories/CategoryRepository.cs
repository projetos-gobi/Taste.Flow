using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(TasteFlowContext context) : base(context)
        {
        }

        public async Task<bool> CreateCategoriesRangeAsync(IEnumerable<Category> categories)
        {
            try
            {
                categories.ToList().ForEach(x =>
                {
                    x.IsActive = true;
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                AddRange(categories);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar as categorias.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> ExistsByAsync<T>(Expression<Func<Category, T>> selector, Guid id, Guid enterpriseId)
        {
            try
            {
                var parameter = selector.Parameters[0];

                var constantType = typeof(T) == typeof(Guid?) ? typeof(Guid?) : typeof(Guid);

                var constant = Expression.Constant(id, constantType);

                var body = Expression.Equal(selector.Body, constant);

                var predicate = Expression.Lambda<Func<Category, bool>>(body, parameter);

                return await DbSet.Where(m => m.EnterpriseId == enterpriseId && m.IsActive && !m.IsDeleted).AnyAsync(predicate);
            }
            catch (Exception ex)
            {
                var message = $"Erro ao verificar existência em categoria.";
                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false; // fallback seguro
            }
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesByEnterpriseIdAsync(Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .Select(x => new Category()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        CategoryTypeId = x.CategoryTypeId,
                        Name = x.Name,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn
                    }).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de buscar todas as categorias pelo EnterpriseId: {enterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Category>();
            }
        }

        public IQueryable<Category> GetCategoriesPaged(Guid enterpriseId)
        {
            var result = GetAllNoTracking()
                .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                .Select(x => new Category()
                {
                    Id = x.Id,
                    EnterpriseId = x.EnterpriseId,
                    CategoryTypeId = x.CategoryTypeId,
                    Name = x.Name,
                    IsActive = x.IsActive,
                    IsDeleted = x.IsDeleted,
                    CreatedOn = x.CreatedOn,
                    CategoryType = new CategoryType()
                    {
                        Id = x.CategoryType.Id,
                        Name = x.CategoryType.Name,
                    }
                });

            return result;
        }

        public async Task<Category> GetCategoryByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .Select(x => new Category()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        CategoryTypeId = x.CategoryTypeId,
                        Name = x.Name,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar uma categoria pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<Category> GetCategoryForUpdateByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de uma categoria pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<IEnumerable<Category>> GetExistingCategoriesAsync(IEnumerable<string> categories, Guid enterpriseId)
        {
            try
            {
                var normalizedItems = categories
                    .Where(n => !string.IsNullOrWhiteSpace(n))
                    .Select(n => n.Trim().ToLower())
                    .ToList();

                var existing = await GetAllNoTracking()
                    .Where(x => x.EnterpriseId == enterpriseId && normalizedItems.Contains(x.Name.ToLower()) && x.IsActive && !x.IsDeleted)
                    .Select(x => new Category()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        Name = x.Name,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                    }).ToListAsync();

                return existing;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a verificação de categorias existentes para a empresa {enterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Category>();
            }
        }

        public async Task<bool> SoftDeleteCategoryAsync(Guid categoryId, Guid enterpriseId, Guid DeletedById)
        {
            try
            {
                var category = await GetCategoryForUpdateByIdAsync(categoryId, enterpriseId);

                if (category == null)
                    return false;

                category.IsDeleted = true;
                category.IsActive = false;
                category.DeletedOn = DateTime.Now.ToUniversalTime();
                //user.DeletedBy = DeletedById;

                Update(category);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar uma categoria ID: {categoryId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateCategoryAsync(Category category, Guid enterpriseId)
        {
            try
            {
                var currentCategory = await GetCategoryForUpdateByIdAsync(category.Id, enterpriseId);

                if (currentCategory == null)
                    return false;

                currentCategory.CategoryTypeId = category.CategoryTypeId;
                currentCategory.Name = category.Name;

                Update(currentCategory);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar uma categoria ID: {category.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
