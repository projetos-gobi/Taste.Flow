using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Merchandise.Queries;
using TasteFlow.Application.Merchandise.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace TasteFlow.Application.Merchandise.Handlers
{
    public class GetMerchandisesPagedHandler : IRequestHandler<GetMerchandisesPagedQuery, PagedResult<GetMerchandisesPagedResponse>>
    {
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetMerchandisesPagedHandler(IMerchandiseRepository merchandiseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _merchandiseRepository = merchandiseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetMerchandisesPagedResponse>> Handle(GetMerchandisesPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _merchandiseRepository.GetMerchandisesPaged(request.EnterpriseId);

                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetMerchandisesPagedResponse>>(result);

                return new PagedResult<GetMerchandisesPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de mercadorias.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetMerchandisesPagedResponse>.Empty();
            }
        }
    }
}
