using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Responses;
using TasteFlow.Application.Common;
using TasteFlow.Application.Common.Filters;

namespace TasteFlow.Application.Enterprise.Queries
{
    public record GetEnterprisesPagedQuery : IRequest<PagedResult<GetEnterprisesPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public EnterpriseFilter Filter { get; set; }
    }
}
