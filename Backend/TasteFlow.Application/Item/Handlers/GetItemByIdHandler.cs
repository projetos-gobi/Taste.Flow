using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Item.Queries;
using TasteFlow.Application.Item.Responses;

namespace TasteFlow.Application.Item.Handlers
{
    public class GetItemByIdHandler : IRequestHandler<GetItemByIdQuery, GetItemByIdResponse>
    {
        private readonly IItemRepository _itemRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetItemByIdHandler(IItemRepository itemRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _itemRepository = itemRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetItemByIdResponse> Handle(GetItemByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _itemRepository.GetItemByIdAsync(request.Id, request.EnterpriseId);

                var response = _mapper.Map<GetItemByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um item pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
