using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Responses;
using TasteFlow.Application.Common;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using TasteFlow.Application.Enterprise.Queries;

namespace TasteFlow.Application.Enterprise.Handlers
{
    public class GetEnterprisesPagedHandler : IRequestHandler<GetEnterprisesPagedQuery, PagedResult<GetEnterprisesPagedResponse>>
    {
        private readonly IEnterpriseRepository _enterpriseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public GetEnterprisesPagedHandler(IEnterpriseRepository enterpriseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _enterpriseRepository = enterpriseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetEnterprisesPagedResponse>> Handle(GetEnterprisesPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _enterpriseRepository.GetEnterprisesPaged();

                if (request.Filter.LicenseId.HasValue)
                    query = query.Where(e => e.LicenseId == request.Filter.LicenseId);

                if (!string.IsNullOrWhiteSpace(request.Filter.FantasyName))
                    query = query.Where(e => e.FantasyName.ToLower().Contains(request.Filter.FantasyName.ToLower()));

                if (!string.IsNullOrWhiteSpace(request.Filter.Cnpj))
                    query = query.Where(e => e.Cnpj == request.Filter.Cnpj);

                if (!string.IsNullOrWhiteSpace(request.Filter.City))
                    query = query.Where(e => e.EnterpriseAddresses.Any(a => a.City.ToLower().Contains(request.Filter.City.ToLower())));

                if (request.Filter.IsActive.HasValue)
                    query = query.Where(e => e.IsActive == request.Filter.IsActive);

                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetEnterprisesPagedResponse>>(result);

                return new PagedResult<GetEnterprisesPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de empresas.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetEnterprisesPagedResponse>.Empty();
            }
        }
    }
}
