using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.CategoryType.Responses;
using TasteFlow.Application.DTOs;

namespace TasteFlow.Application.CategoryType.Commands
{
    public record UpdateCategoryTypeCommand : IRequest<UpdateCategoryTypeResponse>
    {
        public CategoryTypeDTO CategoryType { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
