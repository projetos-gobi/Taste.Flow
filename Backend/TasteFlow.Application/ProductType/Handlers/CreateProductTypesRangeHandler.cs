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
    public class CreateProductTypesRangeHandler : IRequestHandler<CreateProductTypesRangeCommand, CreateProductTypesRangeResponse>
    {
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateProductTypesRangeHandler(IProductTypeRepository productTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateProductTypesRangeResponse> Handle(CreateProductTypesRangeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var productTypes = _mapper.Map<IEnumerable<Domain.Entities.ProductType>>(request.ProductTypes);

                productTypes.ToList().ForEach(x => x.EnterpriseId = request.EnterpriseId);

                var result = await _productTypeRepository.CreateProductTypesRangeAsync(productTypes);

                return new CreateProductTypesRangeResponse(result, ((result) ? "Tipo de produtos criados com sucesso." : "Não foi possível criar os tipos de produto no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de tipo de produtos para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateProductTypesRangeResponse.Empty("Ocorreu um erro durante o processo de criação de tipos de produtos para empresa.");
            }
        }
    }
}
