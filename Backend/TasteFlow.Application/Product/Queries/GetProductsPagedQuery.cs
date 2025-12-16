using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Common.Filters;
using TasteFlow.Application.Product.Responses;

namespace TasteFlow.Application.Product.Queries
{
    public record GetProductsPagedQuery : IRequest<PagedResult<GetProductsPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public ProductFilter Filter { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
