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
using System.Diagnostics;

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
                var sw = Stopwatch.StartNew();

                // SQL direto (Infra) para estabilidade/performance em Postgres+pooler
                var swRepo = Stopwatch.StartNew();
                var (items, totalCount) = await _enterpriseRepository.GetEnterprisesPagedWithCountDirectAsync(
                    request.Query.Page,
                    request.Query.PageSize,
                    request.Filter
                );
                swRepo.Stop();
                Activity.Current?.SetTag("tf_ent_paged_handler_repo", swRepo.Elapsed.TotalMilliseconds);

                // Map manual leve (evita AutoMapper + graphs complexos)
                var swMap = Stopwatch.StartNew();
                var response = items.Select(x => new GetEnterprisesPagedResponse
                {
                    Id = x.Id,
                    LicenseId = x.LicenseId,
                    FantasyName = x.FantasyName,
                    Cnpj = x.Cnpj,
                    LicenseQuantity = x.LicenseQuantity,
                    IsActive = x.IsActive,
                    LicenseName = x.License?.Name,
                    EmailAddress = x.EnterpriseContacts?.FirstOrDefault(ec => !string.IsNullOrWhiteSpace(ec.EmailAddress))?.EmailAddress,
                    Contact = x.EnterpriseContacts?.FirstOrDefault(ec => !string.IsNullOrWhiteSpace(ec.Telephone))?.Telephone,
                    Address = x.EnterpriseAddresses?.FirstOrDefault()?.Street
                }).ToList();
                swMap.Stop();
                Activity.Current?.SetTag("tf_ent_paged_map", swMap.Elapsed.TotalMilliseconds);

                sw.Stop();
                Activity.Current?.SetTag("tf_ent_paged_handler_total", sw.Elapsed.TotalMilliseconds);

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
