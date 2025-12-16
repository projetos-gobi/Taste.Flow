using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.Product.Responses;

namespace TasteFlow.Application.Product.Commands
{
    public record UpdateProductCommand : IRequest<UpdateProductResponse>
    {
        public ProductDTO Product { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
