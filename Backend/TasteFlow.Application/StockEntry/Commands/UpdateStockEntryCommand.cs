using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.StockEntry.Responses;

namespace TasteFlow.Application.StockEntry.Commands
{
    public record UpdateStockEntryCommand : IRequest<UpdateStockEntryResponse>
    {
        public StockEntryDTO StockEntry { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
