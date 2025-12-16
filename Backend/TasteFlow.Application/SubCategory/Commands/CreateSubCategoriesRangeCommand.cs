using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.SubCategory.Responses;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Application.SubCategory.Commands
{
    public record CreateSubCategoriesRangeCommand : IRequest<CreateSubCategoriesRangeResponse>
    {
        public IEnumerable<SubCategoryDTO> SubCategories { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}