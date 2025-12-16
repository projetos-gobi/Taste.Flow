using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.SubCategory.Responses;

namespace TasteFlow.Application.SubCategory.Commands
{
    public record SoftDeleteSubCategoryCommand : IRequest<SoftDeleteSubCategoryResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
