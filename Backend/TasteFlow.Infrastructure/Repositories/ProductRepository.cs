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
    public class ProductRepository : BaseRepository<Product>, IProductRepository
    {
        private readonly IEventLogger _eventLogger;

        public ProductRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
        }

        public async Task<bool> CreateProductAsync(Product product)
        {
            try
            {
                product.IsActive = true;
                product.CreatedOn = DateTime.Now.ToUniversalTime();
                product.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");

                product.ProductCompositions.ToList().ForEach(x =>
                {
                    x.IsActive = true;
                    x.EnterpriseId = product.EnterpriseId;
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                Add(product);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar um produto no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<IEnumerable<Product>> GetAllProductsBySearchTermAsync(Guid enterpriseId, string searchTerm)
        {
            try
            {
                var query = DbSet.Where(x => x.EnterpriseId == enterpriseId && !x.IsDeleted);

                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    query = query.Where(x => x.Name.Contains(searchTerm));
                }

                var result = await query
                    .OrderByDescending(x => x.CreatedOn)
                    .Select(x => new Product
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        CategoryId = x.CategoryId,
                        SubCategoryId = x.SubCategoryId,
                        Name = x.Name,
                        CreatedOn = x.CreatedOn,
                        Category = new Category()
                        {
                            Id = x.CategoryId,
                            Name = x.Category.Name
                        },
                        SubCategory = new SubCategory()
                        {
                            Id = x.SubCategoryId,
                            Name = x.SubCategory.Name
                        }
                    })
                    .ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um produtos pelo searchTerm";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Product>();
            }
        }

        public async Task<Product> GetProductByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .Select(x => new Product()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        CategoryId = x.CategoryId,
                        SubCategoryId = x.SubCategoryId,
                        Name = x.Name,
                        Instruction = x.Instruction,
                        Multiplier = x.Multiplier,
                        Price = x.Price,
                        Yield = x.Yield,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn,
                        ProductCompositions = x.ProductCompositions.Select(pc => new ProductComposition()
                        {
                            Id = pc.Id,
                            EnterpriseId = pc.EnterpriseId,
                            ProductIntermediateId = pc.ProductIntermediateId,
                            MerchandiseId = pc.MerchandiseId,
                            UnitId = pc.UnitId,
                            Quantity = pc.Quantity,
                            Yield = pc.Yield
                        }).ToList()
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um produto pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<Product> GetProductForUpdateByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Include(x => x.ProductCompositions)
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um produto pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public IQueryable<Product> GetProductsPaged(Guid enterpriseId)
        {
            var result = GetAllNoTracking()
                .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                .Select(x => new Product()
                {
                    Id = x.Id,
                    EnterpriseId = x.EnterpriseId,
                    CategoryId = x.CategoryId,
                    SubCategoryId = x.SubCategoryId,
                    Name = x.Name,
                    Yield = x.Yield,
                    IsActive = x.IsActive,
                    Price = x.Price,
                    MarginPercent = x.MarginPercent,
                    MarginValue = x.MarginValue,
                    IsDeleted = x.IsDeleted,
                    CreatedOn = x.CreatedOn,
                    Category = new Category()
                    {
                        Id = x.Category.Id,
                        Name = x.Category.Name,
                    },
                    SubCategory = new SubCategory()
                    {
                        Id = x.SubCategory.Id,
                        Name = x.SubCategory.Name,
                    },
                });

            return result;
        }

        public async Task<bool> SoftDeleteProductAsync(Guid productId, Guid enterpriseId, Guid DeletedById)
        {
            try
            {
                var product = await GetProductForUpdateByIdAsync(productId, enterpriseId);

                if (product == null)
                    return false;

                product.IsDeleted = true;
                product.IsActive = false;
                product.DeletedOn = DateTime.Now.ToUniversalTime();
                //user.DeletedBy = DeletedById;

                product.ProductCompositions.ToList().ForEach(x =>
                {
                    x.IsDeleted = true;
                    x.IsActive = false;
                    x.DeletedOn = DateTime.UtcNow;
                });

                Update(product);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar um produto: {productId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateProductAsync(Product product, Guid enterpriseId)
        {
            try
            {
                var currentProduct = await GetProductForUpdateByIdAsync(product.Id, enterpriseId);

                if (currentProduct == null)
                    return false;

                currentProduct.Name = product.Name;
                currentProduct.CategoryId = product.CategoryId;
                currentProduct.SubCategoryId = product.SubCategoryId;
                currentProduct.Price = product.Price;
                currentProduct.Yield = product.Yield;
                currentProduct.Instruction = product.Instruction;

                Update(currentProduct);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar um produto: {product.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
