using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Common.Filters;
using TasteFlow.Application.Merchandise.Responses;

namespace TasteFlow.Application.Merchandise.Queries
{
    public record GetMerchandisesPagedQuery : IRequest<PagedResult<GetMerchandisesPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public MerchandiseFilter Filter { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
