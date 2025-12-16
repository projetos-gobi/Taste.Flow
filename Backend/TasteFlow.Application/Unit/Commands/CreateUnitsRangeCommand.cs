using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.Unit.Responses;

namespace TasteFlow.Application.Unit.Commands
{
    public record CreateUnitsRangeCommand : IRequest<CreateUnitsRangeResponse>
    {
        public IEnumerable<UnitDTO> Units { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
