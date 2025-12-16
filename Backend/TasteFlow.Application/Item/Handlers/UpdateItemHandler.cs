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
    public class UpdateItemHandler : IRequestHandler<UpdateItemCommand, UpdateItemResponse>
    {
        private readonly IItemRepository _itemRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateItemHandler(IItemRepository itemRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _itemRepository = itemRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateItemResponse> Handle(UpdateItemCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var item = _mapper.Map<Domain.Entities.Item>(request.Item);

                var result = await _itemRepository.UpdateItemAsync(item, request.EnterpriseId);

                return new UpdateItemResponse(result, (result) ? "Item atualizado com sucesso." : "Não foi possível atualizar o item.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de um item pelo ID: {request.Item.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateItemResponse.Empty("Ocorreu um erro durante o processo atualização de um item.");
            }
        }
    }
}
