using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Brand.Responses;

namespace TasteFlow.Application.Brand.Queries
{
    public record GetAllBrandsByEnterpriseIdQuery : IRequest<IEnumerable<GetAllBrandsByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
