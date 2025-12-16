using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.CategoryType.Responses;
using TasteFlow.Application.Common;

namespace TasteFlow.Application.CategoryType.Queries
{
    public record GetCategoryTypesPagedQuery : IRequest<PagedResult<GetCategoryTypesPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
