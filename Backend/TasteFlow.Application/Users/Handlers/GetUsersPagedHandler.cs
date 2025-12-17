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

                // Executar SELECT primeiro (mais rápido)
                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                // COUNT simplificado - apenas contar Users sem os JOINs pesados
                var totalCount = await _usersRepository.GetAllNoTracking()
                    .Where(x => !x.IsDeleted)
                    .CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetUsersPagedResponse>>(result);

                return new PagedResult<GetUsersPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de usuários.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetUsersPagedResponse>.Empty();
            }
        }
    }
}
