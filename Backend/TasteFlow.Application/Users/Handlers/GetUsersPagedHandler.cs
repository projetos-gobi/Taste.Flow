using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Users.Queries;
using TasteFlow.Application.Users.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Users.Handlers
{
    public class GetUsersPagedHandler : IRequestHandler<GetUsersPagedQuery, PagedResult<GetUsersPagedResponse>>
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public GetUsersPagedHandler(IUsersRepository usersRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _usersRepository = usersRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetUsersPagedResponse>> Handle(GetUsersPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                Console.WriteLine("[HANDLER] Starting GetUsersPaged...");

                // REMOVER COMPLETAMENTE Entity Framework - usar apenas ADO.NET direto
                // TEMPORÁRIO: Remover COUNT para priorizar velocidade - usar apenas SELECT
                Console.WriteLine("[HANDLER] Executing SELECT using ADO.NET direct (COUNT disabled for speed)...");
                var result = await _usersRepository.GetUsersPagedDirectAsync(request.Query.Page, request.Query.PageSize, request.Filter);
                var totalCount = result.Count; // Usar count dos resultados por enquanto

                Console.WriteLine($"[HANDLER] SELECT returned {result.Count} users");

                // Mapeamento manual - mais rápido e sem problemas do AutoMapper
                Console.WriteLine("[HANDLER] Mapping results manually...");
                var response = result.Select(u => new GetUsersPagedResponse
                {
                    Id = u.Id,
                    Name = u.Name ?? "",
                    EmailAddress = u.EmailAddress ?? "",
                    AccessProfileId = u.AccessProfileId,
                    EnterpriseName = "", // Não carregamos ainda
                    LicenseName = "", // Não carregamos ainda
                    Contact = "", // Não carregamos ainda
                    AccessProfileName = "", // Não carregamos ainda
                    IsActive = true // Assumir ativo por enquanto
                }).ToList();

                Console.WriteLine($"[HANDLER] Mapped {response.Count} items");

                Console.WriteLine("[HANDLER] Returning PagedResult...");
                return new PagedResult<GetUsersPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[HANDLER ERROR] {ex.Message}");
                Console.WriteLine($"[HANDLER ERROR] Stack: {ex.StackTrace}");
                var message = $"Ocorreu um erro durante o processo paginação de usuários.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetUsersPagedResponse>.Empty();
            }
        }
    }
}
