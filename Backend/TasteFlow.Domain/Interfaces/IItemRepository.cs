using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IItemRepository : IRepository<Item>
    {
        Task<bool> CreateItemsRangeAsync(IEnumerable<Item> items);
        IQueryable<Item> GetItemsPaged(Guid enterpriseId);
        Task<Item> GetItemByIdAsync(Guid id, Guid enterpriseId);
        Task<Item> GetItemForUpdateByIdAsync(Guid id, Guid enterpriseId);
        Task<bool> UpdateItemAsync(Item item, Guid enterpriseId);
        Task<bool> SoftDeleteItemAsync(Guid itemId, Guid enterpriseId, Guid DeletedById);
        Task<IEnumerable<Item>> GetAllItemsByEnterpriseIdAsync(Guid enterpriseId);
        Task<IEnumerable<Item>> GetExistingItemsAsync(IEnumerable<string> items, Guid enterpriseId);
    }
}
