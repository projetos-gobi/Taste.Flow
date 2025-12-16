using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Unit.Responses;

namespace TasteFlow.Application.Unit.Queries
{
    public record GetUnitsPagedQuery : IRequest<PagedResult<GetUnitsPagedResponse>>
    {
        public Guid EnterpriseId { get; set; }
        public PageQuery Query { get; set; }
    }
}
