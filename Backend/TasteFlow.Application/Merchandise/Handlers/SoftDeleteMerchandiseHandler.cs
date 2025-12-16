using AutoMapper;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Merchandise.Commands;
using TasteFlow.Application.Merchandise.Responses;

namespace TasteFlow.Application.Merchandise.Handlers
{
    public class SoftDeleteMerchandiseHandler : IRequestHandler<SoftDeleteMerchandiseCommand, SoftDeleteMerchandiseResponse>
    {
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IProductCompositionRepository _productCompositionRepository;
        private readonly IProductIntermediateCompositionRepository _productIntermediateCompositionRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteMerchandiseHandler(IMerchandiseRepository merchandiseRepository, IProductCompositionRepository productCompositionRepository, IProductIntermediateCompositionRepository productIntermediateCompositionRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _merchandiseRepository = merchandiseRepository;
            _productCompositionRepository = productCompositionRepository;
            _productIntermediateCompositionRepository = productIntermediateCompositionRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteMerchandiseResponse> Handle(SoftDeleteMerchandiseCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var inUseProductFinal = await _productCompositionRepository.ExistsByAsync(x => x.MerchandiseId, request.Id, request.EnterpriseId);

                if (inUseProductFinal)
                {
                    return new SoftDeleteMerchandiseResponse(false, "Não é possível deletar a mercadoria, pois ela está sendo utilizada em Produtos Finais.");
                }

                var inUseProductIntermediate = await _productIntermediateCompositionRepository.ExistsByAsync(x => x.MerchandiseId, request.Id, request.EnterpriseId);

                if (inUseProductIntermediate)
                {
                    return new SoftDeleteMerchandiseResponse(false, "Não é possível deletar a mercadoria, pois ela está sendo utilizada em Produtos Intermediários.");
                }

                var result = await _merchandiseRepository.SoftDeleteMerchandiseAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteMerchandiseResponse(result, (result) ? "Mercadoria foi deletada com sucesso." : "Não foi possível deletar a mercadoria.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de uma mercadoria pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteMerchandiseResponse.Empty("Ocorreu um erro durante o processo soft delete de uma mercadoria.");
            }
        }
    }
}
