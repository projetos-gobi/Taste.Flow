using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Category.Responses;
using TasteFlow.Application.Common;

namespace TasteFlow.Application.Category.Queries
{
    public record GetCategoriesPagedQuery : IRequest<PagedResult<GetCategoriesPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
