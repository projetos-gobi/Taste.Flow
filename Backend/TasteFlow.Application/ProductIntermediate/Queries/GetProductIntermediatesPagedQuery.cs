using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Common.Filters;
using TasteFlow.Application.ProductIntermediate.Responses;

namespace TasteFlow.Application.ProductIntermediate.Queries
{
    public record GetProductIntermediatesPagedQuery : IRequest<PagedResult<GetProductIntermediatesPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public ProductIntermediateFilter Filter { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
