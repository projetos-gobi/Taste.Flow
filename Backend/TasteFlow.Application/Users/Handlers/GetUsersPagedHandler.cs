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
using Microsoft.EntityFrameworkCore;

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
                var query = _usersRepository.GetUsersPaged();

                if (request.Filter.AccessProfileId.HasValue)
                    query = query.Where(e => e.AccessProfileId == request.Filter.AccessProfileId);

                if (!string.IsNullOrWhiteSpace(request.Filter.Name))
                    query = query.Where(e => e.Name.ToLower().Contains(request.Filter.Name.ToLower()));

                if (!string.IsNullOrWhiteSpace(request.Filter.FantasyName))
                    query = query.Where(e => e.UserEnterprises.Any(a => a.Enterprise.FantasyName.ToLower().Contains(request.Filter.FantasyName.ToLower())));

                if (!string.IsNullOrWhiteSpace(request.Filter.EmailAddress))
                    query = query.Where(e => e.EmailAddress.ToLower().Contains(request.Filter.EmailAddress.ToLower()));

                if (request.Filter.IsActive.HasValue)
                    query = query.Where(e => e.IsActive == request.Filter.IsActive);

                Console.WriteLine("[HANDLER] Executing SELECT using ADO.NET direct...");
                // Usar ADO.NET direto para evitar travamento do Entity Framework
                var result = await _usersRepository.GetUsersPagedDirectAsync(request.Query.Page, request.Query.PageSize);

                Console.WriteLine($"[HANDLER] SELECT returned {result.Count} users");

                // TEMPORÁRIO: usar o count dos resultados para não travar
                var totalCount = result.Count;
                Console.WriteLine($"[HANDLER] Using result count as total: {totalCount}");

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
