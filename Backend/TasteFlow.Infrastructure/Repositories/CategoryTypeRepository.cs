using Microsoft.EntityFrameworkCore;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class CategoryTypeRepository : BaseRepository<CategoryType>, ICategoryTypeRepository
    {
        private readonly IEventLogger _eventLogger;

        public CategoryTypeRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
        }

        public async Task<bool> CreateCategoryTypesRangeAsync(IEnumerable<CategoryType> categoryTypes)
        {
            try
            {
                categoryTypes.ToList().ForEach(x =>
                {
                    x.IsActive = true;
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                AddRange(categoryTypes);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar os tipos de categoria.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<IEnumerable<CategoryType>> GetAllCategoryTypesByEnterpriseIdAsync(Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .Select(x => new CategoryType()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        Name = x.Name,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn
                    }).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de buscar todos os tipo de categoria pelo EnterpriseId: {enterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<CategoryType>();
            }
        }

        public async Task<CategoryType> GetCategoryTypeByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .Select(x => new CategoryType()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        Name = x.Name,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar um tipo de categoria pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<CategoryType> GetCategoryTypeForUpdateByIdAsync(Guid id, Guid enterpriseId)
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
                var message = $"Ocorreu um erro durante o processo buscar de um tipo de categoria pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public IQueryable<CategoryType> GetCategoryTypesPaged(Guid enterpriseId)
        {
            var result = GetAllNoTracking()
                .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                .Select(x => new CategoryType()
                {
                    Id = x.Id,
                    EnterpriseId = x.EnterpriseId,
                    Name = x.Name,
                    IsActive = x.IsActive,
                    IsDeleted = x.IsDeleted,
                    CreatedOn = x.CreatedOn
                });

            return result;
        }

        public async Task<IEnumerable<CategoryType>> GetExistingCategoryTypesAsync(IEnumerable<string> categoryTypes, Guid enterpriseId)
        {
            try
            {
                var normalizedItems = categoryTypes
                    .Where(n => !string.IsNullOrWhiteSpace(n))
                    .Select(n => n.Trim().ToLower())
                    .ToList();

                var existing = await GetAllNoTracking()
                    .Where(x => x.EnterpriseId == enterpriseId && normalizedItems.Contains(x.Name.ToLower()) && x.IsActive && !x.IsDeleted)
                    .Select(x => new CategoryType()
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
                var message = $"Ocorreu um erro durante a verificação de tipos de categorias existentes para a empresa {enterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<CategoryType>();
            }
        }

        public async Task<bool> SoftDeleteCategoryTypeAsync(Guid categoryTypeId, Guid enterpriseId, Guid DeletedById)
        {
            try
            {
                var categoryType = await GetCategoryTypeForUpdateByIdAsync(categoryTypeId, enterpriseId);

                if (categoryType == null)
                    return false;

                categoryType.IsDeleted = true;
                categoryType.IsActive = false;
                categoryType.DeletedOn = DateTime.Now.ToUniversalTime();
                //user.DeletedBy = DeletedById;

                Update(categoryType);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar um tipo de categoria ID: {categoryTypeId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateCategoryTypeAsync(CategoryType categoryType, Guid enterpriseId)
        {
            try
            {
                var currentCategoryType = await GetCategoryTypeForUpdateByIdAsync(categoryType.Id, enterpriseId);

                if (currentCategoryType == null)
                    return false;

                currentCategoryType.Name = categoryType.Name;

                Update(currentCategoryType);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar um tipo de categoria ID: {categoryType.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
