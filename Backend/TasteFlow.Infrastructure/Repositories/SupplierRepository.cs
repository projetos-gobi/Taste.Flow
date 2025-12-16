using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class SupplierRepository : BaseRepository<Supplier>, ISupplierRepository
    {
        public SupplierRepository(TasteFlowContext context) : base(context)
        {
        }

        public async Task<bool> CreateSupplierAsync(Supplier supplier)
        {
            try
            {
                supplier.IsActive = true;
                supplier.CreatedOn = DateTime.Now.ToUniversalTime();
                supplier.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");

                supplier.SupplierPaymentDetail.EnterpriseId = supplier.EnterpriseId;
                supplier.SupplierPaymentDetail.CreatedOn = DateTime.Now.ToUniversalTime();
                supplier.SupplierPaymentDetail.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");

                supplier.SupplierPaymentTypes.ToList().ForEach(x =>
                {
                    x.IsActive = true;
                    x.EnterpriseId = supplier.EnterpriseId;
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                Add(supplier);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar um fornecedor para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> ExistsByAsync<T>(Expression<Func<Supplier, T>> selector, Guid id, Guid enterpriseId)
        {
            try
            {
                var parameter = selector.Parameters[0];

                var constantType = typeof(T) == typeof(Guid?) ? typeof(Guid?) : typeof(Guid);

                var constant = Expression.Constant(id, constantType);

                var body = Expression.Equal(selector.Body, constant);

                var predicate = Expression.Lambda<Func<Supplier, bool>>(body, parameter);

                return await DbSet.Where(m => m.EnterpriseId == enterpriseId && m.IsActive && !m.IsDeleted).AnyAsync(predicate);
            }
            catch (Exception ex)
            {
                var message = $"Erro ao verificar existência em fornecedor.";
                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false; // fallback seguro
            }
        }

        public async Task<IEnumerable<Supplier>> GetAllSuppliersByEnterpriseIdAsync(Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .Select(x => new Supplier()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        FantasyName = x.FantasyName,
                        SocialReason = x.SocialReason,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn
                    }).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de buscar todos fornecedores pelo EnterpriseId: {enterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Supplier>();
            }
        }

        public async Task<IEnumerable<Supplier>> GetExistingSuppliersAsync(string fantasyName, string cnpj, Guid enterpriseId)
        {
            try
            {
                var existing = await GetAllNoTracking()
                    .Where(x => (x.FantasyName.ToLower() == fantasyName.ToLower() || x.Cnpj == cnpj) && x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .Select(x => new Supplier()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        FantasyName = x.FantasyName,
                        Cnpj = x.Cnpj,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                    }).ToListAsync();

                return existing;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a verificação de fornecedores existentes para a empresa {enterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Supplier>();
            }
        }

        public async Task<Supplier> GetSupplierByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .Select(x => new Supplier()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        CategoryId = x.CategoryId,
                        SubCategoryId = x.SubCategoryId,
                        FantasyName = x.FantasyName,
                        SocialReason = x.SocialReason,
                        Cnpj = x.Cnpj,
                        Telephone = x.Telephone,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn,
                        SupplierPaymentDetail = new SupplierPaymentDetail()
                        {
                            Id = x.SupplierPaymentDetail.Id,
                            Agency = x.SupplierPaymentDetail.Agency,
                            BankAccountNumber = x.SupplierPaymentDetail.BankAccountNumber,
                            PixKey = x.SupplierPaymentDetail.PixKey,
                        },
                        SupplierPaymentTypes = x.SupplierPaymentTypes.Where(spt => spt.IsActive && !spt.IsDeleted).Select(y => new SupplierPaymentType()
                        {
                            Id = y.Id,
                            PaymentTypeId = y.PaymentTypeId
                        }).ToList()
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar um fornecedor pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<Supplier> GetSupplierForUpdateByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Include(x => x.SupplierPaymentDetail)
                    .Include(x => x.SupplierPaymentTypes)
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um fornecedor pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public IQueryable<Supplier> GetSuppliersPaged(Guid enterpriseId)
        {
            var result = GetAllNoTracking()
                .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                .Select(x => new Supplier()
                {
                    Id = x.Id,
                    EnterpriseId = x.EnterpriseId,
                    CategoryId = x.CategoryId,
                    SubCategoryId = x.SubCategoryId,
                    FantasyName = x.FantasyName,
                    SocialReason = x.SocialReason,
                    Cnpj = x.Cnpj,
                    Telephone = x.Telephone,
                    IsActive = x.IsActive,
                    IsDeleted = x.IsDeleted,
                    CreatedOn = x.CreatedOn,
                    Category = new Category()
                    {
                        Id = x.Category.Id,
                        Name = x.Category.Name
                    },
                    SupplierPaymentTypes = x.SupplierPaymentTypes.Where(spt => spt.IsActive && !spt.IsDeleted).Select(y => new SupplierPaymentType()
                    {
                        Id = y.Id,
                        PaymentType = new PaymentType()
                        {
                            Id = y.PaymentType.Id,
                            Name = y.PaymentType.Name
                        }
                    }).ToList()
                });

            return result;
        }

        public async Task<bool> SoftDeleteSupplierAsync(Guid supplierId, Guid enterpriseId, Guid DeletedById)
        {
            try
            {
                var supplier = await GetSupplierForUpdateByIdAsync(supplierId, enterpriseId);

                if (supplier == null)
                    return false;

                supplier.IsDeleted = true;
                supplier.IsActive = false;
                supplier.DeletedOn = DateTime.Now.ToUniversalTime();
                //user.DeletedBy = DeletedById;

                supplier.SupplierPaymentDetail.IsDeleted = true;
                supplier.SupplierPaymentDetail.IsActive = false;
                supplier.SupplierPaymentDetail.DeletedOn = DateTime.Now.ToUniversalTime();
                //supplier.SupplierPaymentDetail.DeletedBy = deletedById;

                supplier.SupplierPaymentTypes.ToList().ForEach(x =>
                {
                    x.IsDeleted = true;
                    x.IsActive = false;
                    x.DeletedOn = DateTime.Now.ToUniversalTime();
                    //x.DeletedBy = deletedById;
                });

                Update(supplier);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar um fornecedor ID: {supplierId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateSupplierAsync(Supplier supplier, Guid enterpriseId)
        {
            try
            {
                var currentSupplier = await GetSupplierForUpdateByIdAsync(supplier.Id, enterpriseId);

                if (currentSupplier == null)
                    return false;

                currentSupplier.CategoryId = supplier.CategoryId;
                currentSupplier.SubCategoryId = supplier.SubCategoryId;
                currentSupplier.FantasyName = supplier.FantasyName;
                currentSupplier.SocialReason = supplier.SocialReason;
                currentSupplier.Cnpj = supplier.Cnpj;
                currentSupplier.Telephone = supplier.Telephone;
                currentSupplier.ModifiedOn = DateTime.Now.ToUniversalTime();

                currentSupplier.SupplierPaymentDetail.Agency = supplier.SupplierPaymentDetail.Agency;
                currentSupplier.SupplierPaymentDetail.BankAccountNumber = supplier.SupplierPaymentDetail.BankAccountNumber;
                currentSupplier.SupplierPaymentDetail.PixKey = supplier.SupplierPaymentDetail.PixKey;

                var currentSupplierPaymentTypes = currentSupplier.SupplierPaymentTypes.ToList();
                var newSupplierPaymentTypes = supplier.SupplierPaymentTypes.ToList();

                foreach (var newSupplierPaymentType in newSupplierPaymentTypes)
                {
                    var existing = currentSupplierPaymentTypes.FirstOrDefault(x => x.PaymentTypeId == newSupplierPaymentType.PaymentTypeId);

                    if (existing == null)
                    {
                        newSupplierPaymentType.IsActive = true;
                        newSupplierPaymentType.EnterpriseId = currentSupplier.EnterpriseId;
                        newSupplierPaymentType.CreatedOn = DateTime.Now.ToUniversalTime();
                        newSupplierPaymentType.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");

                        currentSupplier.SupplierPaymentTypes.Add(newSupplierPaymentType);
                    }
                    else if (existing.IsDeleted)
                    {
                        existing.IsDeleted = false;
                        existing.IsActive = true;
                        existing.ModifiedOn = DateTime.Now.ToUniversalTime();
                        // existing.ModifiedBy = newType.ModifiedBy; 
                    }
                }

                foreach (var oldSupplierPaymentType in currentSupplierPaymentTypes)
                {
                    var stillExists = newSupplierPaymentTypes.Any(x => x.PaymentTypeId == oldSupplierPaymentType.PaymentTypeId);

                    if (!stillExists && !oldSupplierPaymentType.IsDeleted)
                    {
                        oldSupplierPaymentType.IsDeleted = true;
                        oldSupplierPaymentType.IsActive = false;
                        oldSupplierPaymentType.ModifiedOn = DateTime.Now.ToUniversalTime();
                        //oldSupplierPaymentType.ModifiedBy = supplier.ModifiedBy;
                    }
                }

                Update(currentSupplier);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar um fornecedor ID: {supplier.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
