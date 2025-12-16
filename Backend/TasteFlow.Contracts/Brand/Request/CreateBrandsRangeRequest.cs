using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Brand.Request
{
    public record CreateBrandsRangeRequest
    {
        public IEnumerable<BrandRequest> Brands { get; set; }
    }
}
