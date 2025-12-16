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
using TasteFlow.Application.Common;
using TasteFlow.Application.Item.Responses;
using Microsoft.EntityFrameworkCore;

namespace TasteFlow.Application.Item.Handlers
{
    public class GetItemsPagedHandler : IRequestHandler<GetItemsPagedQuery, PagedResult<GetItemsPagedResponse>>
    {
        private readonly IItemRepository _itemRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetItemsPagedHandler(IItemRepository itemRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _itemRepository = itemRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetItemsPagedResponse>> Handle(GetItemsPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _itemRepository.GetItemsPaged(request.EnterpriseId);

                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetItemsPagedResponse>>(result);

                return new PagedResult<GetItemsPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de itens.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetItemsPagedResponse>.Empty();
            }
        }
    }
}
