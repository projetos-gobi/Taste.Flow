using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Category.Responses;
using TasteFlow.Application.DTOs;

namespace TasteFlow.Application.Category.Commands
{
    public record UpdateCategoryCommand : IRequest<UpdateCategoryResponse>
    {
        public CategoryDTO Category { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
