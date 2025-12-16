using MediatR;
using TasteFlow.Application.StockEntry.Responses;

namespace TasteFlow.Application.StockEntry.Queries
{
    public record GetStockEntryByIdQuery : IRequest<GetStockEntryByIdResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
