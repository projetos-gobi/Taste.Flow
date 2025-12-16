using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Contracts.Users.Request;

namespace TasteFlow.Contracts.Unit.Request
{
    public record CreateUnitsRangeRequest
    {
        public IEnumerable<UnitRequest> Units { get; set; }
    }
}
