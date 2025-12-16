using AutoMapper;
using MediatR;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Application.ProductType.Commands;
using TasteFlow.Application.ProductType.Responses;

namespace TasteFlow.Application.ProductType.Handlers
{
    public class SoftDeleteProductTypeHandler : IRequestHandler<SoftDeleteProductTypeCommand, SoftDeleteProductTypeResponse>
    {
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteProductTypeHandler(IProductTypeRepository productTypeRepository, IMerchandiseRepository merchandiseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _merchandiseRepository = merchandiseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteProductTypeResponse> Handle(SoftDeleteProductTypeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var inUse = await _merchandiseRepository.ExistsByAsync(m => m.ProductTypeId, request.Id, request.EnterpriseId);

                if (inUse)
                {
                    return new SoftDeleteProductTypeResponse(false, "Não é possível deletar o tipo, pois ele está sendo utilizado em Mercadorias.");
                }

                var result = await _productTypeRepository.SoftDeleteProductTypeAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteProductTypeResponse(result, (result) ? "Tipo de produto foi deletada com sucesso." : "Não foi possível deletar o tipo de produto.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de um tipo de produto pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteProductTypeResponse.Empty("Ocorreu um erro durante o processo soft delete de um tipo de produto.");
            }
        }
    }
}
