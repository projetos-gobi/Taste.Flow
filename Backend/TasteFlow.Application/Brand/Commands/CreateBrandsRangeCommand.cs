using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Brand.Responses;
using TasteFlow.Application.DTOs;

namespace TasteFlow.Application.Brand.Commands
{
    public record CreateBrandsRangeCommand : IRequest<CreateBrandsRangeResponse>
    {
        public IEnumerable<BrandDTO> Brands { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
