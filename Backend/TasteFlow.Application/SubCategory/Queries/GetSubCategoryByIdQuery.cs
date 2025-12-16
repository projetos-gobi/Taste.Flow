using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.SubCategory.Responses;

namespace TasteFlow.Application.SubCategory.Queries
{
    public record GetSubCategoryByIdQuery : IRequest<GetSubCategoryByIdResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
