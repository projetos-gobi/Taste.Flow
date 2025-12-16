using AutoMapper;
using MediatR;
using TasteFlow.Application.ProductType.Queries;
using TasteFlow.Application.ProductType.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.ProductType.Handlers
{
    public class CheckProductTypesExistHandler : IRequestHandler<CheckProductTypesExistQuery, IEnumerable<CheckProductTypesExistResponse>>
    {
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CheckProductTypesExistHandler(IProductTypeRepository productTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CheckProductTypesExistResponse>> Handle(CheckProductTypesExistQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _productTypeRepository.GetExistingProductTypesAsync(request.ProductTypes, request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<CheckProductTypesExistResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a verificação de tipos existentes para a empresa {request.EnterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<CheckProductTypesExistResponse>();
            }
        }
    }
}
