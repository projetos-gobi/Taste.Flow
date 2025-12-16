using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Unit.Responses;

namespace TasteFlow.Application.Unit.Queries
{
    public record GetAllUnitsByEnterpriseIdQuery : IRequest<IEnumerable<GetAllUnitsByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
