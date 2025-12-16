using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;

namespace TasteFlow.Contracts.Brand.Request
{
    public record GetBrandsPagedRequest
    {
        public PageQuery Query { get; set; }
    }
}
