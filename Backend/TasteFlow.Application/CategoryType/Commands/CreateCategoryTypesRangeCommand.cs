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
    public record CreateCategoryTypesRangeCommand : IRequest<CreateCategoryTypesRangeResponse>
    {
        public IEnumerable<CategoryTypeDTO> CategoryTypes { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
