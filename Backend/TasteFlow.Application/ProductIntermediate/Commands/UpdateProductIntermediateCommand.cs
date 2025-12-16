using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.ProductIntermediate.Responses;

namespace TasteFlow.Application.ProductIntermediate.Commands
{
    public record UpdateProductIntermediateCommand : IRequest<UpdateProductIntermediateResponse>
    {
        public ProductIntermediateDTO ProductIntermediate { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
