using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common.Filters;
using TasteFlow.Application.Common;

namespace TasteFlow.Contracts.Supplier.Request
{
    public record GetSuppliersPagedRequest
    {
        public PageQuery Query { get; set; }
        public SupplierFilter Filter { get; set; }
    }
}
