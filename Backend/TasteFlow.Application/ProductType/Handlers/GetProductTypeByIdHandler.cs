using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.ProductType.Queries;
using TasteFlow.Application.ProductType.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Application.Item.Responses;

namespace TasteFlow.Application.ProductType.Handlers
{
    public class GetProductTypeByIdHandler : IRequestHandler<GetProductTypeByIdQuery, GetProductTypeByIdResponse>
    {
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetProductTypeByIdHandler(IProductTypeRepository productTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetProductTypeByIdResponse> Handle(GetProductTypeByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _productTypeRepository.GetProductTypeByIdAsync(request.Id, request.EnterpriseId);

                var response = _mapper.Map<GetProductTypeByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um tipo de produto pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
