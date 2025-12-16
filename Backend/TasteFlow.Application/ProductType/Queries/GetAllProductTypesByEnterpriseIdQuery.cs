using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.ProductType.Responses;

namespace TasteFlow.Application.ProductType.Queries
{
    public record GetAllProductTypesByEnterpriseIdQuery : IRequest<IEnumerable<GetAllProductTypesByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
