using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class MerchandiseRepository : BaseRepository<Merchandise>, IMerchandiseRepository
    {
        public MerchandiseRepository(TasteFlowContext context) : base(context)
        {
        }

        public async Task<bool> CreateMerchandisesRangeAsync(IEnumerable<Merchandise> merchandises)
        {
            try
            {
                merchandises.ToList().ForEach(x =>
                {
                    x.IsActive = true;
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                AddRange(merchandises);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar as mercadorias no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> ExistsByAsync<T>(Expression<Func<Merchandise, T>> selector, Guid id, Guid enterpriseId)
        {
            try
            {
                var parameter = selector.Parameters[0];

                var constantType = typeof(T) == typeof(Guid?) ? typeof(Guid?) : typeof(Guid);

                var constant = Expression.Constant(id, constantType);

                var body = Expression.Equal(selector.Body, constant);

                var predicate = Expression.Lambda<Func<Merchandise, bool>>(body, parameter);

                return await DbSet.Where(m => m.EnterpriseId == enterpriseId && m.IsActive && !m.IsDeleted).AnyAsync(predicate);
            }
            catch (Exception ex)
            {
                var message = $"Erro ao verificar existência em mercadoria.";
                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<IEnumerable<Merchandise>> GetAllMerchandisesByEnterpriseIdAsync(Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .Select(x => new Merchandise()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        ItemId = x.ItemId,
                        BrandId = x.BrandId,
                        ProductTypeId = x.ProductTypeId,
                        CategoryId = x.CategoryId,
                        UnitId = x.UnitId,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn,
                        Item = new Item()
                        {
                            Id = x.Item.Id,
                            Name = x.Item.Name,
                        },
                        Brand = new Brand()
                        {
                            Id = (x.BrandId.HasValue) ? x.BrandId.Value : Guid.Empty,
                            Name = x.Brand.Name,
                        },
                        ProductType = new ProductType()
                        {
                            Id = (x.ProductTypeId.HasValue) ? x.ProductTypeId.Value : Guid.Empty,
                            Name = x.ProductType.Name,
                        }
                    }).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de buscar todas mercadorias pelo EnterpriseId: {enterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Merchandise>();
            }
        }

        public async Task<Merchandise> GetMerchandiseByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .Select(x => new Merchandise()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        ItemId = x.ItemId,
                        BrandId = x.BrandId,
                        ProductTypeId = x.ProductTypeId,
                        CategoryId = x.CategoryId,
                        UnitId = x.UnitId,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de uma mercadoria pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<Merchandise> GetMerchandiseForUpdateByIdAsync(Guid id, Guid enterpriseId)
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
                var message = $"Ocorreu um erro durante o processo buscar de uma mercadoria pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public IQueryable<Merchandise> GetMerchandisesPaged(Guid enterpriseId)
        {
            var result = GetAllNoTracking()
                .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                .Select(x => new Merchandise()
                {
                    Id = x.Id,
                    EnterpriseId = x.EnterpriseId,
                    Item = new Item()
                    {
                        Id = x.Item.Id,
                        Name = x.Item.Name,
                    },
                    Brand = new Brand()
                    {
                        Id = (x.BrandId.HasValue)? x.BrandId.Value : Guid.Empty,
                        Name = x.Brand.Name,
                    },
                    ProductType = new ProductType()
                    {
                        Id = (x.ProductTypeId.HasValue) ? x.ProductTypeId.Value : Guid.Empty,
                        Name = x.ProductType.Name,
                    },
                    Category = new Category()
                    {
                        Id = x.Category.Id,
                        Name = x.Category.Name,
                    },
                    Unit = new Unit()
                    {
                        Id = x.Unit.Id,
                        Name = x.Unit.Name,
                    },
                    IsActive = x.IsActive,
                    IsDeleted = x.IsDeleted,
                    CreatedOn = x.CreatedOn
                });

            return result;
        }

        public async Task<bool> SoftDeleteMerchandiseAsync(Guid merchandiseId, Guid enterpriseId, Guid DeletedById)
        {
            try
            {
                var item = await GetMerchandiseForUpdateByIdAsync(merchandiseId, enterpriseId);

                if (item == null)
                    return false;

                item.IsDeleted = true;
                item.IsActive = false;
                item.DeletedOn = DateTime.Now.ToUniversalTime();
                //user.DeletedBy = DeletedById;

                Update(item);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar uma mercadoria: {merchandiseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateMerchandiseAsync(Merchandise merchandise, Guid enterpriseId)
        {
            try
            {
                var currentMerchandise = await GetMerchandiseForUpdateByIdAsync(merchandise.Id, enterpriseId);

                if (currentMerchandise == null)
                    return false;

                currentMerchandise.ItemId = merchandise.ItemId;
                currentMerchandise.BrandId = merchandise.BrandId;
                currentMerchandise.ProductTypeId = merchandise.ProductTypeId;
                currentMerchandise.CategoryId = merchandise.CategoryId;
                currentMerchandise.UnitId = merchandise.UnitId;

                Update(currentMerchandise);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar uma mercadoria: {merchandise.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
