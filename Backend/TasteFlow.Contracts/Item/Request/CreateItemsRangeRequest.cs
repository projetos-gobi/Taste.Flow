using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Item.Request
{
    public record CreateItemsRangeRequest
    {
        public IEnumerable<ItemRequest> Items { get; set; }
    }
}
