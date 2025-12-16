using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Unit.Queries;
using TasteFlow.Application.Unit.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Application.Common;
using Microsoft.EntityFrameworkCore;

namespace TasteFlow.Application.Unit.Handlers
{
    public class GetUnitsPagedHandler : IRequestHandler<GetUnitsPagedQuery, PagedResult<GetUnitsPagedResponse>>
    {
        private readonly IUnitRepository _unitRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetUnitsPagedHandler(IUnitRepository unitRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _unitRepository = unitRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetUnitsPagedResponse>> Handle(GetUnitsPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _unitRepository.GetUnitsPaged(request.EnterpriseId);

                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetUnitsPagedResponse>>(result);

                return new PagedResult<GetUnitsPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de unidades.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetUnitsPagedResponse>.Empty();
            }
        }
    }
}
