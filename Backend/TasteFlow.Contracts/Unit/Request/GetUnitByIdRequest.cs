using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Unit.Request
{
    public record GetUnitByIdRequest
    {
        public Guid Id { get; set; }
    }
}
