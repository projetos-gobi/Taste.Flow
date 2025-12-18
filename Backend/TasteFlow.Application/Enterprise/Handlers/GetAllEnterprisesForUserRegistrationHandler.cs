using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Enterprise.Queries;
using TasteFlow.Application.Enterprise.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Application.Enterprise.Handlers
{
    public class GetAllEnterprisesForUserRegistrationHandler : IRequestHandler<GetAllEnterprisesForUserRegistrationQuery, IEnumerable<GetAllEnterprisesForUserRegistrationResponse>>
    {
        private readonly IEnterpriseRepository _enterpriseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public GetAllEnterprisesForUserRegistrationHandler(IEnterpriseRepository enterpriseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _enterpriseRepository = enterpriseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllEnterprisesForUserRegistrationResponse>> Handle(GetAllEnterprisesForUserRegistrationQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var sw = Stopwatch.StartNew();
                // Repositório já calcula LicenseQuantity corretamente usando ADO.NET direto
                var result = await _enterpriseRepository.GetAllEnterprisesForUserRegistrationAsync();

                var swMap = Stopwatch.StartNew();
                var responses = _mapper.Map<IEnumerable<GetAllEnterprisesForUserRegistrationResponse>>(result);
                swMap.Stop();
                Activity.Current?.SetTag("tf_ent_map", swMap.Elapsed.TotalMilliseconds);

                sw.Stop();
                Activity.Current?.SetTag("tf_ent_handler_total", sw.Elapsed.TotalMilliseconds);
                return responses;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de buscar empresas para cadastro de usuários.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllEnterprisesForUserRegistrationResponse>();
            }
        }
    }
}
