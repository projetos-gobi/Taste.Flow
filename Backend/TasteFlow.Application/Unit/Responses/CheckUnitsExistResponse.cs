using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Unit.Responses
{
    public record CheckUnitsExistResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
