using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.ProductType.Request
{
    public record CreateProductTypesRangeRequest
    {
        public IEnumerable<ProductTypeRequest> ProductTypes { get; set; }
    }
}
