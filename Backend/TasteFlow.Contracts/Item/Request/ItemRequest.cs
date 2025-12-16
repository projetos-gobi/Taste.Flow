using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Item.Request
{
    public record ItemRequest
    {
        public string Name { get; set; }
    }
}
