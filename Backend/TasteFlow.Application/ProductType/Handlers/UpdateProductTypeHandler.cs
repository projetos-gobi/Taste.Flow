using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.ProductType.Commands;
using TasteFlow.Application.ProductType.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.ProductType.Handlers
{
    public class UpdateProductTypeHandler : IRequestHandler<UpdateProductTypeCommand, UpdateProductTypeResponse>
    {
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateProductTypeHandler(IProductTypeRepository productTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateProductTypeResponse> Handle(UpdateProductTypeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var productType = _mapper.Map<Domain.Entities.ProductType>(request.ProductType);

                var result = await _productTypeRepository.UpdateProductTypeAsync(productType, request.EnterpriseId);

                return new UpdateProductTypeResponse(result, (result) ? "Item atualizado com sucesso." : "Não foi possível atualizar o item.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de um tipo de produto ID: {request.ProductType.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateProductTypeResponse.Empty("Ocorreu um erro durante o processo atualização de um tipo de produto.");
            }
        }
    }
}
