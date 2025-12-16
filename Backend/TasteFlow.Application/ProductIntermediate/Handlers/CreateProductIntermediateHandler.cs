using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.ProductIntermediate.Commands;
using TasteFlow.Application.ProductIntermediate.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.ProductIntermediate.Handlers
{
    public class CreateProductIntermediateHandler : IRequestHandler<CreateProductIntermediateCommand, CreateProductIntermediateResponse>
    {
        private readonly IProductIntermediateRepository _productIntermediateRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateProductIntermediateHandler(IProductIntermediateRepository productIntermediateRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productIntermediateRepository = productIntermediateRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateProductIntermediateResponse> Handle(CreateProductIntermediateCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var productIntermediate = _mapper.Map<Domain.Entities.ProductIntermediate>(request.ProductIntermediate);
                productIntermediate.EnterpriseId = request.EnterpriseId;
                
                var result = await _productIntermediateRepository.CreateProductIntermediateAsync(productIntermediate);

                return new CreateProductIntermediateResponse(result, ((result) ? "Produto intermediário criado com sucesso." : "Não foi possível criar O produto intermediário no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de produto intermediário para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateProductIntermediateResponse.Empty("Ocorreu um erro durante o processo de criação de um produto intermediário para empresa.");
            }
        }
    }
}
