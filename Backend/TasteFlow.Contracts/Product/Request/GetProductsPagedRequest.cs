using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common.Filters;
using TasteFlow.Application.Common;

namespace TasteFlow.Contracts.Product.Request
{
    public record GetProductsPagedRequest
    {
        public PageQuery Query { get; set; }
        public ProductFilter Filter { get; set; }
    }
}
