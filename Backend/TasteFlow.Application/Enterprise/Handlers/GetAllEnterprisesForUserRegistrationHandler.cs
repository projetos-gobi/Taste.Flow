using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
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
                Console.WriteLine("[HANDLER ENTERPRISE] Starting GetAllEnterprisesForUserRegistration...");
                
                // Repositório já calcula LicenseQuantity corretamente usando ADO.NET direto
                var result = await _enterpriseRepository.GetAllEnterprisesForUserRegistrationAsync();

                Console.WriteLine($"[HANDLER ENTERPRISE] Repository returned {result.Count()} enterprises");

                var responses = _mapper.Map<IEnumerable<GetAllEnterprisesForUserRegistrationResponse>>(result);

                Console.WriteLine($"[HANDLER ENTERPRISE] Mapped to {responses.Count()} responses");

                return responses;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[HANDLER ENTERPRISE ERROR] {ex.Message}");
                Console.WriteLine($"[HANDLER ENTERPRISE ERROR] Stack: {ex.StackTrace}");
                
                var message = $"Ocorreu um erro durante o processo de buscar empresas para cadastro de usuários.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllEnterprisesForUserRegistrationResponse>();
            }
        }
    }
}
