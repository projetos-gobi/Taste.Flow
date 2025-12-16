using Microsoft.EntityFrameworkCore;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class StockEntryAttachmentRepository : BaseRepository<StockEntryAttachment>, IStockEntryAttachmentRepository
    {
        public StockEntryAttachmentRepository(TasteFlowContext context) : base(context)
        {
        }

        public async Task<StockEntryAttachment> GetStockEntryAttachmentByIdAsync(Guid id, Guid enterpriseId)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.EnterpriseId == enterpriseId && x.IsActive && !x.IsDeleted)
                    .Select(x => new StockEntryAttachment()
                    {
                        Id = x.Id,
                        EnterpriseId = x.EnterpriseId,
                        StockEntryId = x.StockEntryId,
                        FileName = x.FileName,
                        FilePath = x.FilePath,
                        FileExtension = x.FileExtension,
                        FileSize = x.FileSize,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um arquivo entrada de estoque pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
