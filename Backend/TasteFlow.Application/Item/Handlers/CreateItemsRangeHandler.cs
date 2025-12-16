using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Item.Commands;
using TasteFlow.Application.Item.Responses;

namespace TasteFlow.Application.Item.Handlers
{
    public class CreateItemsRangeHandler : IRequestHandler<CreateItemsRangeCommand, CreateItemsRangeResponse>
    {
        private readonly IItemRepository _itemRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateItemsRangeHandler(IItemRepository itemRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _itemRepository = itemRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateItemsRangeResponse> Handle(CreateItemsRangeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var items = _mapper.Map<IEnumerable<Domain.Entities.Item>>(request.Items);

                items.ToList().ForEach(x => x.EnterpriseId = request.EnterpriseId);

                var result = await _itemRepository.CreateItemsRangeAsync(items);

                return new CreateItemsRangeResponse(result, ((result) ? "Itens criados com sucesso." : "Não foi possível criar os itens no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de itens para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateItemsRangeResponse.Empty("Ocorreu um erro durante o processo de criação de itens para empresa.");
            }
        }
    }
}
