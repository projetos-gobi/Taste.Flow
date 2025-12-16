using AutoMapper;
using MediatR;
using TasteFlow.Application.Item.Queries;
using TasteFlow.Application.Item.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Application.Item.Handlers
{
    public class CheckItemsExistHandler : IRequestHandler<CheckItemsExistQuery, IEnumerable<CheckItemsExistResponse>>
    {
        private readonly IItemRepository _itemRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CheckItemsExistHandler(IItemRepository itemRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _itemRepository = itemRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CheckItemsExistResponse>> Handle(CheckItemsExistQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _itemRepository.GetExistingItemsAsync(request.Items, request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<CheckItemsExistResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a verificação de itens existentes para a empresa {request.EnterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<CheckItemsExistResponse>();
            }
        }
    }
}
