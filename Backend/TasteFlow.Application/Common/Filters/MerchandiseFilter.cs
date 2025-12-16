using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Common.Filters
{
    public class MerchandiseFilter
    {
        public Guid? CategoryId { get; set; }
        public Guid? UnitId { get; set; }
        public Guid? ProductTypeId { get; set; }
        public string? SearchQuery { get; set; }
    }
}
