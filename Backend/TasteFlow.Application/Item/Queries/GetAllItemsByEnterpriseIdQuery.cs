using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Item.Responses;

namespace TasteFlow.Application.Item.Queries
{
    public record GetAllItemsByEnterpriseIdQuery : IRequest<IEnumerable<GetAllItemsByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
