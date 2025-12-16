using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.SubCategory.Responses;

namespace TasteFlow.Application.SubCategory.Commands
{
    public record UpdateSubCategoryCommand : IRequest<UpdateSubCategoryResponse>
    {
        public SubCategoryDTO SubCategory { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
