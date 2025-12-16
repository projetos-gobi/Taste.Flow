using MediatR;
using TasteFlow.Application.ProductAlternative.Responses;

namespace TasteFlow.Application.ProductAlternative.Queries
{
    public record GetAllProductAlternativesByProductIdQuery : IRequest<List<GetAllProductAlternativesByProductIdResponse>>
    {
        public Guid ProductId { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
