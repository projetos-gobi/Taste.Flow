using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.CategoryType.Responses;

namespace TasteFlow.Application.CategoryType.Queries
{
    public record GetCategoryTypeByIdQuery : IRequest<GetCategoryTypeByIdResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
