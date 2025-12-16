using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Category.Responses;

namespace TasteFlow.Application.Category.Commands
{
    public record SoftDeleteCategoryCommand : IRequest<SoftDeleteCategoryResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
