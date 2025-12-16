using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IStockEntryAttachmentRepository : IRepository<StockEntryAttachment>
    {
        Task<StockEntryAttachment> GetStockEntryAttachmentByIdAsync(Guid id, Guid enterpriseId);
    }
}
