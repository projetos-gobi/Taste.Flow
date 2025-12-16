using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.SubCategory.Responses;

namespace TasteFlow.Application.SubCategory.Queries
{
    public record GetAllSubCategoriesByEnterpriseIdQuery : IRequest<IEnumerable<GetAllSubCategoriesByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
