using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Merchandise.Responses;

namespace TasteFlow.Application.Merchandise.Commands
{
    public record SoftDeleteMerchandiseCommand : IRequest<SoftDeleteMerchandiseResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
