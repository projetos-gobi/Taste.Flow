using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.SubCategory.Responses;

namespace TasteFlow.Application.SubCategory.Queries
{
    public record GetSubCategoriesPagedQuery : IRequest<PagedResult<GetSubCategoriesPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
