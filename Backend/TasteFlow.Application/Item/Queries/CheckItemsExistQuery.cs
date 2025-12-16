using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Item.Responses;

namespace TasteFlow.Application.Item.Queries
{
    public record CheckItemsExistQuery : IRequest<IEnumerable<CheckItemsExistResponse>>
    {
        public IEnumerable<string> Items { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
