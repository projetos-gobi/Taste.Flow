using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Product.Responses;

namespace TasteFlow.Application.Product.Commands
{
    public record SoftDeleteProductCommand : IRequest<SoftDeleteProductResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
