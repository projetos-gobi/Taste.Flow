using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Category.Responses;

namespace TasteFlow.Application.Category.Queries
{
    public record GetAllCategoriesByEnterpriseIdQuery : IRequest<IEnumerable<GetAllCategoriesByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
