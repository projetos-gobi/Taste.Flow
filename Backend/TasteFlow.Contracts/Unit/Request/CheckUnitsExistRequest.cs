using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Unit.Request
{
    public record CheckUnitsExistRequest
    {
        public IEnumerable<string> Units { get; set; }
    }
}
