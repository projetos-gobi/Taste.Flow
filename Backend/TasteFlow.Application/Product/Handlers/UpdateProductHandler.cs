using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Product.Commands;
using TasteFlow.Application.Product.Responses;

namespace TasteFlow.Application.Product.Handlers
{
    public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, UpdateProductResponse>
    {
        private readonly IProductRepository _productRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateProductHandler(IProductRepository productRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productRepository = productRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateProductResponse> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var product = _mapper.Map<Domain.Entities.Product>(request.Product);

                var result = await _productRepository.UpdateProductAsync(product, request.EnterpriseId);

                return new UpdateProductResponse(result, (result) ? "Produto atualizado com sucesso." : "Não foi possível atualizar o produto.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de atualização de um produto pelo ID: {request.Product.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateProductResponse.Empty("Ocorreu um erro durante o processo atualização de um produto.");
            }
        }
    }
}
