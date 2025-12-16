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
    public class StockEntryRepository : BaseRepository<StockEntry>, IStockEntryRepository
    {
        private readonly IEventLogger _eventLogger;

        public StockEntryRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
        }

        public async Task<bool> CreateStockEntryAsync(StockEntry stockEntry)
        {
            try
            {
                stockEntry.IsActive = true;
                stockEntry.CreatedOn = DateTime.Now;
                stockEntry.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");

                stockEntry.StockEntryItems.ToList().ForEach(x =>
                {
                    x.EnterpriseId = stockEntry.EnterpriseId;
                    x.IsActive = true;
                    x.CreatedOn = DateTime.Now;
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                stockEntry.StockEntryAttachments.ToList().ForEach(x =>
                {
                    x.EnterpriseId = stockEntry.EnterpriseId;
                    x.IsActive = true;
                    x.CreatedOn = DateTime.Now;
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                Add(stockEntry);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar controle de estoque no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public IQueryable<StockEntry> GetStockEntriesPaged(Guid enterpriseId)
        {
            var result = GetAllNoTracking()
                .Include(x => x.Supplier)
                .Include(x => x.StockEntryItems).ThenInclude(i => i.Merchandise).ThenInclude(m => m.Item)
                .Include(x => x.StockEntryItems).ThenInclude(i => i.Merchandise) .ThenInclude(m => m.Brand)
                .Where(x => x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                .Select(x => new StockEntry()
                {
                    Id = x.Id,
                    EnterpriseId = x.EnterpriseId,
                    SupplierId = x.SupplierId,
                    PaymentTypeId = x.PaymentTermId,
                    TotalAmount = x.TotalAmount,
                    PurchaseDate = x.PurchaseDate,
                    ExpectedDeliveryDate = x.ExpectedDeliveryDate,
                    IsDeliveryCompleted = x.IsDeliveryCompleted,
                    InvoiceNumber = x.InvoiceNumber,
                    IsActive = x.IsActive,
                    IsDeleted = x.IsDeleted,
                    CreatedOn = x.CreatedOn,
                    Supplier = new Supplier()
                    {
                        Id = x.SupplierId,
                        FantasyName = x.Supplier.FantasyName
                    },
                    PaymentType = new PaymentType()
                    {
                        Id = x.PaymentTypeId,
                        Name = x.PaymentType.Name
                    },
                    StockEntryItems = x.StockEntryItems.Where(s => s.IsActive && !s.IsDeleted).Select(y => new StockEntryItem()
                    {
                        Id = y.Id,
                        Merchandise = new Merchandise()
                        {
                            Id = y.MerchandiseId,
                            Item = new Item() 
                            { 
                                Name = y.Merchandise.Item.Name 
                            },
                            Brand = new Brand() 
                            { 
                                Name = y.Merchandise.Brand.Name 
                            }
                        }
                    }).ToList(),
                    StockEntryAttachments = x.StockEntryAttachments.Where(a => a.IsActive && !a.IsDeleted).Select(sa => new StockEntryAttachment()
                    {
                        Id = sa.Id
                    }).ToList()
                });

            return result;
        }

        public async Task<StockEntry> GetStockEntryByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && !x.IsDeleted)
                    .Select(x => new StockEntry()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        SupplierId = x.SupplierId,
                        PaymentTypeId = x.PaymentTypeId,
                        PaymentTermId = x.PaymentTermId,
                        ReceivedBy = x.ReceivedBy,
                        IsDeliveryCompleted = x.IsDeliveryCompleted,
                        InvoiceNumber = x.InvoiceNumber,
                        TotalAmount = x.TotalAmount,
                        PurchaseDate = x.PurchaseDate,
                        ExpectedDeliveryDate = x.ExpectedDeliveryDate,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn,
                        StockEntryItems = x.StockEntryItems.Where(y => y.IsActive && !y.IsDeleted).Select(y => new StockEntryItem()
                        {
                            Id = y.Id,
                            StockEntryId = y.StockEntryId,
                            MerchandiseId = y.MerchandiseId,
                            CategoryId = y.CategoryId,
                            UnitId = y.UnitId,
                            Quantity = y.Quantity,
                            TotalAmount = y.TotalAmount,
                            IsActive = y.IsActive,
                            IsDeleted = y.IsDeleted
                        }).ToList(),
                        StockEntryAttachments = x.StockEntryAttachments.Where(a => a.IsActive && !a.IsDeleted).Select(a => new StockEntryAttachment()
                        {
                            Id = a.Id,
                            FileName = a.FileName,
                            FileExtension = a.FileExtension,
                            FilePath = a.FilePath,
                            IsActive = a.IsActive,
                            IsDeleted = a.IsDeleted
                        }).ToList()
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um nota de estoque de entrada pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<StockEntry> GetStockEntryForUpdateByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Include(x => x.StockEntryItems)
                    .Include(x => x.StockEntryAttachments)
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar uma nota de entrada de estoque pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<IEnumerable<StockEntry>> GetStockValueByEnterpriseIdAsync(Guid enterpriseId)
        {
            try
            {
                var threeMonthsAgo = DateTime.UtcNow.AddMonths(-3);

                var recentEntries = await DbSet
                    .Include(se => se.StockEntryItems)
                    .ThenInclude(item => item.Merchandise)
                    .Where(se => se.EnterpriseId == enterpriseId
                                 && se.PurchaseDate.HasValue
                                 && se.PurchaseDate.Value >= threeMonthsAgo
                                 && se.IsActive
                                 && !se.IsDeleted).ToListAsync();

                var recentMerchandiseIds = recentEntries
                    .SelectMany(se => se.StockEntryItems)
                    .Where(i => i.IsActive && !i.IsDeleted)
                    .Select(i => i.MerchandiseId)
                    .Distinct()
                    .ToHashSet();

                var olderEntriesQuery = DbSet
                    .Include(se => se.StockEntryItems)
                    .ThenInclude(item => item.Merchandise)
                    .Where(se => se.EnterpriseId == enterpriseId
                                 && se.PurchaseDate.HasValue
                                 && se.PurchaseDate.Value < threeMonthsAgo
                                 && se.IsActive
                                 && !se.IsDeleted
                                 && se.StockEntryItems.Any(item => !recentMerchandiseIds.Contains(item.MerchandiseId)));

                var olderEntriesRaw = await olderEntriesQuery.ToListAsync();

                var olderEntries = olderEntriesRaw
                    .SelectMany(se => se.StockEntryItems.Select(item => new { se, item }))
                    .Where(x => !recentMerchandiseIds.Contains(x.item.MerchandiseId))
                    .GroupBy(x => x.item.MerchandiseId)
                    .Select(g => g.OrderByDescending(x => x.se.PurchaseDate).First().se)
                    .Distinct()
                    .ToList();

                var result = recentEntries.Concat(olderEntries).Distinct();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao calcular o valor médio das mercadorias para a empresa {enterpriseId} nos últimos 3 meses.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<StockEntry>();
            }
        }

        public async Task<bool> SoftDeleteStockEntryAsync(Guid stockEntryId, Guid enterpriseId, Guid DeletedById)
        {
            try
            {
                var item = await GetStockEntryForUpdateByIdAsync(stockEntryId, enterpriseId);

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
                var message = $"Ocorreu um erro ao deletar um nota de entrada de estoque: {stockEntryId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateStockEntryAsync(StockEntry stockEntry, Guid enterpriseId)
        {
            try
            {
                var currentStockEntry = await GetStockEntryForUpdateByIdAsync(stockEntry.Id, enterpriseId);

                if (currentStockEntry == null)
                    return false;

                currentStockEntry.SupplierId = stockEntry.SupplierId;
                currentStockEntry.PaymentTypeId = stockEntry.PaymentTypeId;
                currentStockEntry.PaymentTermId = stockEntry.PaymentTermId;
                currentStockEntry.PurchaseDate = stockEntry.PurchaseDate;
                currentStockEntry.ExpectedDeliveryDate = stockEntry.ExpectedDeliveryDate;
                currentStockEntry.ReceivedBy = stockEntry.ReceivedBy;
                currentStockEntry.IsDeliveryCompleted = stockEntry.IsDeliveryCompleted;
                currentStockEntry.InvoiceNumber = stockEntry.InvoiceNumber;
                currentStockEntry.TotalAmount = stockEntry.TotalAmount;
                currentStockEntry.ModifiedOn = DateTime.UtcNow;

                var currentStockEntryItems = currentStockEntry.StockEntryItems.ToList();
                var newStockEntryItems = stockEntry.StockEntryItems.ToList();

                foreach (var newStockEntryItem in newStockEntryItems)
                {
                    var existing = currentStockEntryItems.FirstOrDefault(x => x.Id == newStockEntryItem.Id && x.Id != Guid.Empty);

                    if (existing == null)
                    {
                        newStockEntryItem.EnterpriseId = currentStockEntry.EnterpriseId;
                        newStockEntryItem.StockEntryId = currentStockEntry.Id;
                        newStockEntryItem.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                        newStockEntryItem.CreatedOn = DateTime.Now.ToUniversalTime();
                        newStockEntryItem.IsActive = true;

                        currentStockEntry.StockEntryItems.Add(newStockEntryItem);
                    }
                    else
                    {
                        existing.MerchandiseId = newStockEntryItem.MerchandiseId;
                        existing.CategoryId = newStockEntryItem.CategoryId;
                        existing.UnitId = newStockEntryItem.UnitId;
                        existing.Quantity = newStockEntryItem.Quantity;
                        existing.TotalAmount = newStockEntryItem.TotalAmount;
                    }
                }

                foreach (var oldStockEntryItem in currentStockEntryItems)
                {
                    var stillExists = newStockEntryItems.Any(x => (x.Id != Guid.Empty && x.Id == oldStockEntryItem.Id));

                    if (!stillExists && !oldStockEntryItem.IsDeleted)
                    {
                        oldStockEntryItem.IsDeleted = true;
                        oldStockEntryItem.IsActive = false;
                        oldStockEntryItem.ModifiedOn = DateTime.Now.ToUniversalTime();
                        //oldSupplierPaymentType.ModifiedBy = supplier.ModifiedBy;
                    }
                }

                var currentAttachments = currentStockEntry.StockEntryAttachments.ToList();
                var newAttachments = stockEntry.StockEntryAttachments.ToList();

                foreach (var newAttachment in stockEntry.StockEntryAttachments.Where(x => x.Id == Guid.Empty))
                {
                    newAttachment.EnterpriseId = currentStockEntry.EnterpriseId;
                    newAttachment.StockEntryId = currentStockEntry.Id;
                    newAttachment.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                    newAttachment.CreatedOn = DateTime.UtcNow;
                    newAttachment.IsActive = true;
                    newAttachment.IsDeleted = false;

                    currentStockEntry.StockEntryAttachments.Add(newAttachment);
                }

                foreach (var existingAttachment in currentAttachments)
                {
                    var updatedAttachment = newAttachments.FirstOrDefault(x => x.Id == existingAttachment.Id);

                    if (updatedAttachment != null)
                    {
                        if (existingAttachment.IsDeleted != updatedAttachment.IsDeleted)
                        {
                            existingAttachment.IsDeleted = updatedAttachment.IsDeleted;
                            existingAttachment.IsActive = !updatedAttachment.IsDeleted;
                            existingAttachment.ModifiedOn = DateTime.UtcNow;
                        }
                    }
                }

                Update(currentStockEntry);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar um controle de entrada: {stockEntry.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
