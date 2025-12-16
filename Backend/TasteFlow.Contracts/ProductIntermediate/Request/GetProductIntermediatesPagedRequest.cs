using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Common.Filters;

namespace TasteFlow.Contracts.ProductIntermediate.Request
{
    public record GetProductIntermediatesPagedRequest
    {
        public PageQuery Query { get; set; }
        public ProductIntermediateFilter Filter { get; set; }
    }
}
