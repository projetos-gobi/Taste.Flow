using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Brand.Responses;
using TasteFlow.Application.Common;

namespace TasteFlow.Application.Brand.Queries
{
    public record GetBrandsPagedQuery : IRequest<PagedResult<GetBrandsPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
