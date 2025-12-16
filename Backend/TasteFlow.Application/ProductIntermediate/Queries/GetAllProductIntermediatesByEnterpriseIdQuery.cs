using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.ProductIntermediate.Responses;

namespace TasteFlow.Application.ProductIntermediate.Queries
{
    public record GetAllProductIntermediatesByEnterpriseIdQuery : IRequest<IEnumerable<GetAllProductIntermediatesByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
