using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Merchandise.Responses;

namespace TasteFlow.Application.Merchandise.Queries
{
    public record GetAllMerchandisesByEnterpriseIdQuery : IRequest<IEnumerable<GetAllMerchandisesByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
