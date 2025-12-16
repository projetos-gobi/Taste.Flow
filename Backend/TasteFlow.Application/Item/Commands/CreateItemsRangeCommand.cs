using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.Item.Responses;

namespace TasteFlow.Application.Item.Commands
{
    public record CreateItemsRangeCommand : IRequest<CreateItemsRangeResponse>
    {
        public IEnumerable<ItemDTO> Items { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
