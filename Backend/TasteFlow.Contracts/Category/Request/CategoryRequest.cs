using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Category.Request
{
    public record CategoryRequest
    {
        public Guid CategoryTypeId { get; set; }
        public string Name { get; set; }
    }
}
