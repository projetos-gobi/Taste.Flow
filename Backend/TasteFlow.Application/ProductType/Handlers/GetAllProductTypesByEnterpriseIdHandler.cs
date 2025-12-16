using AutoMapper;
using MediatR;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.ProductType.Queries;
using TasteFlow.Application.ProductType.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.ProductType.Handlers
{
    public class GetAllProductTypesByEnterpriseIdHandler : IRequestHandler<GetAllProductTypesByEnterpriseIdQuery, IEnumerable<GetAllProductTypesByEnterpriseIdResponse>>
    {
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllProductTypesByEnterpriseIdHandler(IProductTypeRepository productTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllProductTypesByEnterpriseIdResponse>> Handle(GetAllProductTypesByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _productTypeRepository.GetAllProductTypesByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllProductTypesByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todos os tipos pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllProductTypesByEnterpriseIdResponse>();
            }
        }
    }
}
