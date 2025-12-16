using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IStockEntryRepository : IRepository<StockEntry>
    {
        Task<bool> CreateStockEntryAsync(StockEntry stockEntry);
        IQueryable<StockEntry> GetStockEntriesPaged(Guid enterpriseId);
        Task<StockEntry> GetStockEntryByIdAsync(Guid id, Guid enterpriseId);
        Task<StockEntry> GetStockEntryForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateStockEntryAsync(StockEntry stockEntry, Guid enterpriseId);
        Task<bool> SoftDeleteStockEntryAsync(Guid stockEntryId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<StockEntry>> GetStockValueByEnterpriseIdAsync(Guid enterpriseId);
    }
}
