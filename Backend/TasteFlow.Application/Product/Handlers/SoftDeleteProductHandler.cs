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
    public class SoftDeleteProductHandler : IRequestHandler<SoftDeleteProductCommand, SoftDeleteProductResponse>
    {
        private readonly IProductRepository _productRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteProductHandler(IProductRepository productRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productRepository = productRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteProductResponse> Handle(SoftDeleteProductCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _productRepository.SoftDeleteProductAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteProductResponse(result, (result) ? "produto foi deletado com sucesso." : "Não foi possível deletar o produto.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de um produto pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteProductResponse.Empty("Ocorreu um erro durante o processo soft delete de um produto.");
            }
        }
    }
}
