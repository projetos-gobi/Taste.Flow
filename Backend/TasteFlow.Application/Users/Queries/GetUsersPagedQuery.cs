using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Common.Filters;
using TasteFlow.Application.Users.Responses;

namespace TasteFlow.Application.Users.Queries
{
    public record GetUsersPagedQuery : IRequest<PagedResult<GetUsersPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public UserFilter Filter { get; set; }
    }
}
