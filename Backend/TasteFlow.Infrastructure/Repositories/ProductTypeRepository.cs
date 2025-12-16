using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Log;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class ProductTypeRepository : BaseRepository<ProductType>, IProductTypeRepository
    {
        private readonly IEventLogger _eventLogger;

        public ProductTypeRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
        }

        public async Task<bool> CreateProductTypesRangeAsync(IEnumerable<ProductType> productTypes)
        {
            try
            {
                productTypes.ToList().ForEach(x =>
                {
                    x.IsActive = true;
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                AddRange(productTypes);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar os tipos de produtos no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<IEnumerable<ProductType>> GetAllProductTypesByEnterpriseIdAsync(Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .Select(x => new ProductType()
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
                var message = $"Ocorreu um erro durante o processo de buscar todos os tipos pelo EnterpriseId: {enterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<ProductType>();
            }
        }

        public async Task<IEnumerable<ProductType>> GetExistingProductTypesAsync(IEnumerable<string> productTypes, Guid enterpriseId)
        {
            try
            {
                var normalizedItems = productTypes
                    .Where(n => !string.IsNullOrWhiteSpace(n))
                    .Select(n => n.Trim().ToLower())
                    .ToList();

                var existing = await GetAllNoTracking()
                    .Where(x => x.EnterpriseId == enterpriseId && normalizedItems.Contains(x.Name.ToLower()) && x.IsActive && !x.IsDeleted)
                    .Select(x => new ProductType()
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
                var message = $"Ocorreu um erro durante a verificação de tipos existentes para a empresa {enterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<ProductType>();
            }
        }

        public async Task<ProductType> GetProductTypeByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .Select(x => new ProductType()
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
                var message = $"Ocorreu um erro durante o processo buscar de um tipo de produto pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<ProductType> GetProductTypeForUpdateByIdAsync(Guid id, Guid enterpriseId)
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
                var message = $"Ocorreu um erro durante o processo buscar de um tipo de produto pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public IQueryable<ProductType> GetProductTypesPaged(Guid enterpriseId)
        {
            var result = GetAllNoTracking()
                .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                .Select(x => new ProductType()
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

        public async Task<bool> SoftDeleteProductTypeAsync(Guid productTypeId, Guid enterpriseId, Guid DeletedById)
        {
            try
            {
                var productType = await GetProductTypeForUpdateByIdAsync(productTypeId, enterpriseId);

                if (productType == null)
                    return false;

                productType.IsDeleted = true;
                productType.IsActive = false;
                productType.DeletedOn = DateTime.Now.ToUniversalTime();
                //user.DeletedBy = DeletedById;

                Update(productType);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar um tipo de produto: {productTypeId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateProductTypeAsync(ProductType productType, Guid enterpriseId)
        {
            try
            {
                var currentProductType = await GetProductTypeForUpdateByIdAsync(productType.Id, enterpriseId);

                if (currentProductType == null)
                    return false;

                currentProductType.Name = productType.Name;

                Update(currentProductType);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar um tipo de produto: {productType.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
