using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Brand.Request
{
    public record CheckBrandsExistRequest
    {
        public IEnumerable<string> Brands { get; set; }
    }
}
