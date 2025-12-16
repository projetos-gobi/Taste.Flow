using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.ProductIntermediate.Queries;
using TasteFlow.Application.ProductIntermediate.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.ProductIntermediate.Handlers
{
    public class GetAllProductIntermediatesByEnterpriseIdHandler : IRequestHandler<GetAllProductIntermediatesByEnterpriseIdQuery, IEnumerable<GetAllProductIntermediatesByEnterpriseIdResponse>>
    {
        private readonly IProductIntermediateRepository _productIntermediateRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllProductIntermediatesByEnterpriseIdHandler(IProductIntermediateRepository productIntermediateRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productIntermediateRepository = productIntermediateRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllProductIntermediatesByEnterpriseIdResponse>> Handle(GetAllProductIntermediatesByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _productIntermediateRepository.GetAllProductIntermediatesByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllProductIntermediatesByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todos os produtos intermediários pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllProductIntermediatesByEnterpriseIdResponse>();
            }
        }
    }
}
