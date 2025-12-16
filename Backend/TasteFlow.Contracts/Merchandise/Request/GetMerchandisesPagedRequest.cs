using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common.Filters;
using TasteFlow.Application.Common;

namespace TasteFlow.Contracts.Merchandise.Request
{
    public record GetMerchandisesPagedRequest
    {
        public PageQuery Query { get; set; }
        public MerchandiseFilter Filter { get; set; }
    }
}
