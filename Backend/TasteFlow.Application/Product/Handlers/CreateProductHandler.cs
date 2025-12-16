using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Product.Commands;
using TasteFlow.Application.Product.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Product.Handlers
{
    public class CreateProductHandler : IRequestHandler<CreateProductCommand, CreateProductResponse>
    {
        private readonly IProductRepository _productRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateProductHandler(IProductRepository productRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productRepository = productRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateProductResponse> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var product = _mapper.Map<Domain.Entities.Product>(request.Product);
                product.EnterpriseId = request.EnterpriseId;

                var result = await _productRepository.CreateProductAsync(product);

                return new CreateProductResponse(result, ((result) ? "Produto criado com sucesso." : "Não foi possível criar o produto no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de produto para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateProductResponse.Empty("Ocorreu um erro durante o processo de criação de um produto para empresa.");
            }
        }
    }
}
