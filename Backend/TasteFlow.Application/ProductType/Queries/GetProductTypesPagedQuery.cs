using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.ProductType.Responses;

namespace TasteFlow.Application.ProductType.Queries
{
    public record GetProductTypesPagedQuery : IRequest<PagedResult<GetProductTypesPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
