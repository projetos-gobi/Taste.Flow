using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Item.Responses;

namespace TasteFlow.Application.Item.Queries
{
    public record GetItemsPagedQuery : IRequest<PagedResult<GetItemsPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
