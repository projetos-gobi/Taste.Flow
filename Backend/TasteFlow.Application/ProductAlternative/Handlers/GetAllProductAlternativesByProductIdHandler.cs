using MediatR;
using TasteFlow.Application.ProductAlternative.Queries;
using TasteFlow.Application.ProductAlternative.Responses;

namespace TasteFlow.Application.ProductAlternative.Handlers
{
    public class GetAllProductAlternativesByProductIdHandler : IRequestHandler<GetAllProductAlternativesByProductIdQuery, List<GetAllProductAlternativesByProductIdResponse>>
    {
        public GetAllProductAlternativesByProductIdHandler()
        {
        }

        public async Task<List<GetAllProductAlternativesByProductIdResponse>> Handle(GetAllProductAlternativesByProductIdQuery request, CancellationToken cancellationToken)
        {
            // TODO: Implementar busca de alternativas de produto
            // Por enquanto, retorna lista vazia para permitir compilação
            return new List<GetAllProductAlternativesByProductIdResponse>();
        }
    }
}
