using AutoMapper;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Item.Commands;
using TasteFlow.Application.Item.Responses;

namespace TasteFlow.Application.Item.Handlers
{
    public class SoftDeleteItemHandler : IRequestHandler<SoftDeleteItemCommand, SoftDeleteItemResponse>
    {
        private readonly IItemRepository _itemRepository;
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteItemHandler(IItemRepository itemRepository, IMerchandiseRepository merchandiseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _itemRepository = itemRepository;
            _merchandiseRepository = merchandiseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteItemResponse> Handle(SoftDeleteItemCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var inUse = await _merchandiseRepository.ExistsByAsync(m => m.ItemId, request.Id, request.EnterpriseId);

                if (inUse)
                {
                    return new SoftDeleteItemResponse(false, "Não é possível deletar o item, pois ele está sendo utilizado em Mercadorias.");
                }

                var result = await _itemRepository.SoftDeleteItemAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteItemResponse(result, (result) ? "Item foi deletada com sucesso." : "Não foi possível deletar o item.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de um item pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteItemResponse.Empty("Ocorreu um erro durante o processo soft delete de um item.");
            }
        }
    }
}
