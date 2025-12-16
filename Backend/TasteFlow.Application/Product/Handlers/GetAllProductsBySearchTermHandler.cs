using AutoMapper;
using MediatR;
using TasteFlow.Application.Product.Queries;
using TasteFlow.Application.Product.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Product.Handlers
{
    public class GetAllProductsBySearchTermHandler : IRequestHandler<GetAllProductsBySearchTermQuery, IEnumerable<GetAllProductsBySearchTermResponse>>
    {
        private readonly IProductRepository _productRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllProductsBySearchTermHandler(IProductRepository productRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productRepository = productRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllProductsBySearchTermResponse>> Handle(GetAllProductsBySearchTermQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _productRepository.GetAllProductsBySearchTermAsync(request.EnterpriseId, request.SearchTerm);

                var response = _mapper.Map<IEnumerable<GetAllProductsBySearchTermResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um produtos pelo searchTerm EnterpriseID: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllProductsBySearchTermResponse>();
            }
        }
    }
}
