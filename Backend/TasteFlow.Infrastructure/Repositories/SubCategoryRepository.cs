using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class SubCategoryRepository : BaseRepository<SubCategory>, ISubCategoryRepository
    {
        private readonly IEventLogger _eventLogger;

        public SubCategoryRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
        }

        public async Task<bool> CreateSubCategoriesRangeAsync(IEnumerable<SubCategory> subCategories)
        {
            try
            {
                subCategories.ToList().ForEach(x =>
                {
                    x.IsActive = true;
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                AddRange(subCategories);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar as sub categorias no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<IEnumerable<SubCategory>> GetAllSubCategoriesByEnterpriseIdAsync(Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .Select(x => new SubCategory()
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
                var message = $"Ocorreu um erro durante o processo de buscar todas as sub-categorias pelo EnterpriseId: {enterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<SubCategory>();
            }
        }

        public async Task<IEnumerable<SubCategory>> GetExistingSubCategoriesAsync(IEnumerable<string> subCategories, Guid enterpriseId)
        {
            try
            {
                var normalizedItems = subCategories
                    .Where(n => !string.IsNullOrWhiteSpace(n))
                    .Select(n => n.Trim().ToLower())
                    .ToList();

                var existing = await GetAllNoTracking()
                    .Where(x => x.EnterpriseId == enterpriseId && normalizedItems.Contains(x.Name.ToLower()) && x.IsActive && !x.IsDeleted)
                    .Select(x => new SubCategory()
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
                var message = $"Ocorreu um erro durante a verificação de sub-categorias existentes para a empresa {enterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<SubCategory>();
            }
        }

        public IQueryable<SubCategory> GetSubCategoriesPaged(Guid enterpriseId)
        {
            var result = GetAllNoTracking()
                .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                .Select(x => new SubCategory()
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

        public async Task<SubCategory> GetSubCategoryByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .Select(x => new SubCategory()
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
                var message = $"Ocorreu um erro durante o processo buscar de uma sub categoria pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<SubCategory> GetSubCategoryForUpdateByIdAsync(Guid id, Guid enterpriseId)
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
                var message = $"Ocorreu um erro durante o processo buscar de uma sub categoria pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<bool> SoftDeleteSubCategoryAsync(Guid subCategoryId, Guid enterpriseId, Guid DeletedById)
        {
            try
            {
                var subCategory = await GetSubCategoryForUpdateByIdAsync(subCategoryId, enterpriseId);

                if (subCategory == null)
                    return false;

                subCategory.IsDeleted = true;
                subCategory.IsActive = false;
                subCategory.DeletedOn = DateTime.Now.ToUniversalTime();
                //user.DeletedBy = DeletedById;

                Update(subCategory);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar uma sub categoria: {subCategoryId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateSubCategoryAsync(SubCategory subCategory, Guid enterpriseId)
        {
            try
            {
                var currentSubCategory = await GetSubCategoryForUpdateByIdAsync(subCategory.Id, enterpriseId);

                if (currentSubCategory == null)
                    return false;

                currentSubCategory.Name = subCategory.Name;

                Update(currentSubCategory);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar uma sub categoria: {subCategory.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
