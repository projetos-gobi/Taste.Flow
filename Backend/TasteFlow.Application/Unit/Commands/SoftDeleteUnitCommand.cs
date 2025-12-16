using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Unit.Responses;

namespace TasteFlow.Application.Unit.Commands
{
    public record SoftDeleteUnitCommand : IRequest<SoftDeleteUnitResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
