using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.StockEntry.Request
{
    public record SoftDeleteStockEntryRequest
    {
        public Guid Id { get; set; }
    }
}
