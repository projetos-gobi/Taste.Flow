using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Item.Queries;
using TasteFlow.Application.Item.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Item.Handlers
{
    public class GetAllItemsByEnterpriseIdHandler : IRequestHandler<GetAllItemsByEnterpriseIdQuery, IEnumerable<GetAllItemsByEnterpriseIdResponse>>
    {
        private readonly IItemRepository _itemRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllItemsByEnterpriseIdHandler(IItemRepository itemRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _itemRepository = itemRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllItemsByEnterpriseIdResponse>> Handle(GetAllItemsByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _itemRepository.GetAllItemsByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllItemsByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todos os itens pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllItemsByEnterpriseIdResponse>();
            }
        }
    }
}
