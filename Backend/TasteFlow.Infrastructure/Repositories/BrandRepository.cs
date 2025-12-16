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
    public class BrandRepository : BaseRepository<Brand>, IBrandRepository
    {
        private readonly IEventLogger _eventLogger;

        public BrandRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
        }

        public async Task<bool> CreateBrandsRangeAsync(IEnumerable<Brand> brands)
        {
            try
            {
                brands.ToList().ForEach(x =>
                {
                    x.IsActive = true;
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                AddRange(brands);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar as marcas no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<IEnumerable<Brand>> GetAllBrandsByEnterpriseIdAsync(Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .Select(x => new Brand()
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
                var message = $"Ocorreu um erro durante o processo de buscar todas as marcas pelo EnterpriseId: {enterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Brand>();
            }
        }

        public async Task<Brand> GetBrandByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .Select(x => new Brand()
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
                var message = $"Ocorreu um erro durante o processo buscar de uma marca pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<Brand> GetBrandForUpdateByIdAsync(Guid id, Guid enterpriseId)
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
                var message = $"Ocorreu um erro durante o processo buscar de uma marca pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public IQueryable<Brand> GetBrandsPaged(Guid enterpriseId)
        {
            var result = GetAllNoTracking()
                .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                .Select(x => new Brand()
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

        public async Task<IEnumerable<Brand>> GetExistingBrandsAsync(IEnumerable<string> brands, Guid enterpriseId)
        {
            try
            {
                var normalizedItems = brands
                    .Where(n => !string.IsNullOrWhiteSpace(n))
                    .Select(n => n.Trim().ToLower())
                    .ToList();

                var existing = await GetAllNoTracking()
                    .Where(x => x.EnterpriseId == enterpriseId && normalizedItems.Contains(x.Name.ToLower()) && x.IsActive && !x.IsDeleted)
                    .Select(x => new Brand()
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
                var message = $"Ocorreu um erro durante a verificação de marcas existentes para a empresa {enterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Brand>();
            }
        }

        public async Task<bool> SoftDeleteBrandAsync(Guid brandId, Guid enterpriseId, Guid DeletedById)
        {
            try
            {
                var brand = await GetBrandForUpdateByIdAsync(brandId, enterpriseId);

                if (brand == null)
                    return false;

                brand.IsDeleted = true;
                brand.IsActive = false;
                brand.DeletedOn = DateTime.Now.ToUniversalTime();
                //user.DeletedBy = DeletedById;

                Update(brand);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar uma marca ID: {brandId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateBrandAsync(Brand brand, Guid enterpriseId)
        {
            try
            {
                var currentBrand = await GetBrandForUpdateByIdAsync(brand.Id, enterpriseId);

                if (currentBrand == null)
                    return false;

                currentBrand.Name = brand.Name;

                Update(currentBrand);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar uma marca ID: {brand.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
