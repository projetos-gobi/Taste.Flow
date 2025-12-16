using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Common.Filters;
using TasteFlow.Application.Supplier.Responses;

namespace TasteFlow.Application.Supplier.Queries
{
    public record GetSuppliersPagedQuery : IRequest<PagedResult<GetSuppliersPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public SupplierFilter Filter { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
