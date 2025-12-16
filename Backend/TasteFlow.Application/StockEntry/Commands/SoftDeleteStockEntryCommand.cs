using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.StockEntry.Responses;

namespace TasteFlow.Application.StockEntry.Commands
{
    public record SoftDeleteStockEntryCommand : IRequest<SoftDeleteStockEntryResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
