using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Unit.Responses;

namespace TasteFlow.Application.Unit.Queries
{
    public record CheckUnitsExistQuery : IRequest<IEnumerable<CheckUnitsExistResponse>>
    {
        public IEnumerable<string> Units { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
