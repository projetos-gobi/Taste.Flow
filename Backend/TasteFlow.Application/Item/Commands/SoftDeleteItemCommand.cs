using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Item.Responses;

namespace TasteFlow.Application.Item.Commands
{
    public record SoftDeleteItemCommand : IRequest<SoftDeleteItemResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
