using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class ProductIntermediateRepository : BaseRepository<ProductIntermediate>, IProductIntermediateRepository
    {
        private readonly IEventLogger _eventLogger;

        public ProductIntermediateRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
        }

        public async Task<bool> CreateProductIntermediateAsync(ProductIntermediate productIntermediate)
        {
            try
            {
                productIntermediate.IsActive = true;
                productIntermediate.CreatedOn = DateTime.Now.ToUniversalTime();
                productIntermediate.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");

                productIntermediate.ProductIntermediateCompositions.ToList().ForEach(x =>
                {
                    x.IsActive = true;
                    x.EnterpriseId = productIntermediate.EnterpriseId;
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                Add(productIntermediate);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar um produto intermediário no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> ExistsByAsync<T>(Expression<Func<ProductIntermediate, T>> selector, Guid id, Guid enterpriseId)
        {
            try
            {
                var parameter = selector.Parameters[0];

                var constantType = typeof(T) == typeof(Guid?) ? typeof(Guid?) : typeof(Guid);

                var constant = Expression.Constant(id, constantType);

                var body = Expression.Equal(selector.Body, constant);

                var predicate = Expression.Lambda<Func<ProductIntermediate, bool>>(body, parameter);

                return await DbSet.Where(m => m.EnterpriseId == enterpriseId && m.IsActive && !m.IsDeleted).AnyAsync(predicate);
            }
            catch (Exception ex)
            {
                var message = $"Erro ao verificar existência em produto intermediário.";
                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<IEnumerable<ProductIntermediate>> GetAllProductIntermediatesByEnterpriseIdAsync(Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .Select(x => new ProductIntermediate()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        CategoryId = x.CategoryId,
                        SubCategoryId = x.SubCategoryId,
                        UnitId = x.UnitId,
                        Yield = x.Yield,
                        Price = x.Price,
                        Name = x.Name,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn
                    }).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de buscar todos os produtos intermediários pelo EnterpriseId: {enterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<ProductIntermediate>();
            }
        }

        public async Task<ProductIntermediate> GetProductIntermediateByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .Select(x => new ProductIntermediate()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        CategoryId = x.CategoryId,
                        SubCategoryId = x.SubCategoryId,
                        UnitId = x.UnitId,
                        Name = x.Name,
                        Description = x.Description,
                        Instruction = x.Instruction,
                        Yield = x.Yield,
                        PreparationTime = x.PreparationTime,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn,
                        ProductIntermediateCompositions = x.ProductIntermediateCompositions.Select(y => new ProductIntermediateComposition() 
                        {
                            Id = y.Id,
                            EnterpriseId = y.EnterpriseId,
                            ProductIntermediateId = y.ProductIntermediateId,
                            MerchandiseId = y.MerchandiseId,
                            UnitId = y.UnitId,
                            Quantity = y.Quantity,
                            Yield = y.Yield
                        }).ToList()
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um produto intermediário pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<ProductIntermediate> GetProductIntermediateForUpdateByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Include(x => x.ProductIntermediateCompositions)
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um produto intermediário pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public IQueryable<ProductIntermediate> GetProductIntermediatesPaged(Guid enterpriseId)
        {
            var result = GetAllNoTracking()
                .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                .Select(x => new ProductIntermediate()
                {
                    Id = x.Id,
                    EnterpriseId = x.EnterpriseId,
                    Name = x.Name,
                    Yield = x.Yield,
                    Price = x.Price,
                    IsActive = x.IsActive,
                    IsDeleted = x.IsDeleted,
                    CreatedOn = x.CreatedOn,
                    Category = new Category()
                    {
                        Id = ((x.CategoryId.HasValue)? x.CategoryId.Value : Guid.Empty),
                        Name = x.Category.Name,
                    },
                    SubCategory = new SubCategory()
                    {
                        Id = ((x.SubCategoryId.HasValue) ? x.SubCategoryId.Value : Guid.Empty),
                        Name = x.SubCategory.Name,
                    },
                });

            return result;
        }

        public async Task<bool> SoftDeleteProductIntermediateAsync(Guid productIntermediateId, Guid enterpriseId, Guid DeletedById)
        {
            try
            {
                var productIntermediate = await GetProductIntermediateForUpdateByIdAsync(productIntermediateId, enterpriseId);

                if (productIntermediate == null)
                    return false;

                productIntermediate.IsDeleted = true;
                productIntermediate.IsActive = false;
                productIntermediate.DeletedOn = DateTime.Now.ToUniversalTime();
                //user.DeletedBy = DeletedById;

                productIntermediate.ProductIntermediateCompositions.ToList().ForEach(x =>
                {
                    x.IsDeleted = true;
                    x.IsActive = false;
                    x.DeletedOn = DateTime.UtcNow;
                });

                Update(productIntermediate);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar um produto intermediário: {productIntermediateId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateProductIntermediateAsync(ProductIntermediate productIntermediate, Guid enterpriseId)
        {
            try
            {
                var currentProductIntermediate = await GetProductIntermediateForUpdateByIdAsync(productIntermediate.Id, enterpriseId);

                if (currentProductIntermediate == null)
                    return false;

                currentProductIntermediate.CategoryId = productIntermediate.CategoryId;
                currentProductIntermediate.SubCategoryId = productIntermediate.SubCategoryId;
                currentProductIntermediate.UnitId = productIntermediate.UnitId;
                currentProductIntermediate.Name = productIntermediate.Name;
                currentProductIntermediate.Description = productIntermediate.Description;
                currentProductIntermediate.Instruction = productIntermediate.Instruction;
                currentProductIntermediate.Yield = productIntermediate.Yield;
                currentProductIntermediate.PreparationTime = productIntermediate.PreparationTime;
                currentProductIntermediate.Price = productIntermediate.Price;

                var currentProductIntermediateCompositions = currentProductIntermediate.ProductIntermediateCompositions.ToList();
                var newProductIntermediateCompositions = productIntermediate.ProductIntermediateCompositions.ToList();

                foreach (var newProductIntermediateComposition in newProductIntermediateCompositions)
                {
                    var existing = currentProductIntermediateCompositions.FirstOrDefault(x => x.Id == newProductIntermediateComposition.Id && x.Id != Guid.Empty);

                    if (existing == null)
                    {
                        newProductIntermediateComposition.Id = Guid.NewGuid();
                        newProductIntermediateComposition.EnterpriseId = currentProductIntermediate.EnterpriseId;
                        newProductIntermediateComposition.ProductIntermediateId = currentProductIntermediate.Id;
                        newProductIntermediateComposition.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                        newProductIntermediateComposition.CreatedOn = DateTime.Now.ToUniversalTime();
                        newProductIntermediateComposition.IsActive = true;

                        currentProductIntermediate.ProductIntermediateCompositions.Add(newProductIntermediateComposition);
                    }
                    else
                    {
                        existing.Quantity = newProductIntermediateComposition.Quantity;
                        existing.Yield = newProductIntermediateComposition.Yield;
                        existing.UnitId = newProductIntermediateComposition.UnitId;
                        existing.MerchandiseId = newProductIntermediateComposition.MerchandiseId;
                    }
                }

                foreach (var oldProductIntermediateComposition in currentProductIntermediateCompositions)
                {
                    var stillExists = newProductIntermediateCompositions.Any(x => (x.Id != Guid.Empty && x.Id == oldProductIntermediateComposition.Id));

                    if (!stillExists && !oldProductIntermediateComposition.IsDeleted)
                    {
                        oldProductIntermediateComposition.IsDeleted = true;
                        oldProductIntermediateComposition.IsActive = false;
                        oldProductIntermediateComposition.ModifiedOn = DateTime.Now.ToUniversalTime();
                        //oldSupplierPaymentType.ModifiedBy = supplier.ModifiedBy;
                    }
                }

                Update(currentProductIntermediate);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar um produto intermediário: {productIntermediate.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
