using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.ProductIntermediate.Queries;
using TasteFlow.Application.ProductIntermediate.Responses;

namespace TasteFlow.Application.ProductIntermediate.Handlers
{
    public class GetProductIntermediateByIdHandler : IRequestHandler<GetProductIntermediateByIdQuery, GetProductIntermediateByIdResponse>
    {
        private readonly IProductIntermediateRepository _productIntermediateRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetProductIntermediateByIdHandler(IProductIntermediateRepository productIntermediateRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productIntermediateRepository = productIntermediateRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetProductIntermediateByIdResponse> Handle(GetProductIntermediateByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _productIntermediateRepository.GetProductIntermediateByIdAsync(request.Id, request.EnterpriseId);

                var response = _mapper.Map<GetProductIntermediateByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um produto intermediário pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
