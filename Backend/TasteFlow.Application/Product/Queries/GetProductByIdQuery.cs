using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Product.Responses;

namespace TasteFlow.Application.Product.Queries
{
    public record GetProductByIdQuery : IRequest<GetProductByIdResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
