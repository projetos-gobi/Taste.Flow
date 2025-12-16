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
    public class UpdateProductIntermediateHandler : IRequestHandler<UpdateProductIntermediateCommand, UpdateProductIntermediateResponse>
    {
        private readonly IProductIntermediateRepository _productIntermediateRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateProductIntermediateHandler(IProductIntermediateRepository productIntermediateRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productIntermediateRepository = productIntermediateRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateProductIntermediateResponse> Handle(UpdateProductIntermediateCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var productIntermediate = _mapper.Map<Domain.Entities.ProductIntermediate>(request.ProductIntermediate);

                var result = await _productIntermediateRepository.UpdateProductIntermediateAsync(productIntermediate, request.EnterpriseId);

                return new UpdateProductIntermediateResponse(result, (result) ? "Produto intermediário atualizado com sucesso." : "Não foi possível atualizar o produto intermediário.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de atualização de um produto intermediário pelo ID: {request.ProductIntermediate.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateProductIntermediateResponse.Empty("Ocorreu um erro durante o processo atualização de um produto intermediário.");
            }
        }
    }
}
