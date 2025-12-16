using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.ProductIntermediate.Commands;
using TasteFlow.Application.ProductIntermediate.Responses;

namespace TasteFlow.Application.ProductIntermediate.Handlers
{
    public class SoftDeleteProductIntermediateHandler : IRequestHandler<SoftDeleteProductIntermediateCommand, SoftDeleteProductIntermediateResponse>
    {
        private readonly IProductIntermediateRepository _productIntermediateRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteProductIntermediateHandler(IProductIntermediateRepository productIntermediateRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productIntermediateRepository = productIntermediateRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteProductIntermediateResponse> Handle(SoftDeleteProductIntermediateCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _productIntermediateRepository.SoftDeleteProductIntermediateAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteProductIntermediateResponse(result, (result) ? "produto intermediário foi deletada com sucesso." : "Não foi possível deletar o produto intermediário.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de um produto intermediário pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteProductIntermediateResponse.Empty("Ocorreu um erro durante o processo soft delete de um produto intermediário.");
            }
        }
    }
}
