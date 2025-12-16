using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.ProductType.Responses;

namespace TasteFlow.Application.ProductType.Commands
{
    public record CreateProductTypesRangeCommand : IRequest<CreateProductTypesRangeResponse>
    {
        public IEnumerable<ProductTypeDTO> ProductTypes { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
