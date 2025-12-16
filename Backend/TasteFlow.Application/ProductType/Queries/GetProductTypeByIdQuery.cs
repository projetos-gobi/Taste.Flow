using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.ProductType.Responses;

namespace TasteFlow.Application.ProductType.Queries
{
    public record GetProductTypeByIdQuery : IRequest<GetProductTypeByIdResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
