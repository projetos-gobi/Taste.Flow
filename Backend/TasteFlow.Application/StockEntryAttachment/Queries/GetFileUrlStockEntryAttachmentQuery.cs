using MediatR;
using TasteFlow.Application.StockEntryAttachment.Responses;

namespace TasteFlow.Application.StockEntryAttachment.Queries
{
    public record GetFileUrlStockEntryAttachmentQuery : IRequest<GetFileUrlStockEntryAttachmentResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
