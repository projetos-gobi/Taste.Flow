using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;

namespace TasteFlow.Contracts.Item.Request
{
    public record GetItemsPagedRequest
    {
        public PageQuery Query { get; set; }
    }
}
