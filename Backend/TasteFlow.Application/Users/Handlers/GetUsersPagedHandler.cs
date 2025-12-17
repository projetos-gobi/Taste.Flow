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
                Console.WriteLine("[HANDLER] Executing SELECT + COUNT using ADO.NET direct (same connection)...");
                var (result, totalCount) = await _usersRepository.GetUsersPagedWithCountDirectAsync(request.Query.Page, request.Query.PageSize, request.Filter);

                Console.WriteLine($"[HANDLER] SELECT returned {result.Count} users, total count: {totalCount}");

                Console.WriteLine("[HANDLER] Mapping results...");
                var response = _mapper.Map<List<GetUsersPagedResponse>>(result);

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
