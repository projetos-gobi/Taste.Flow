using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.StockEntry.Responses
{
    public record SoftDeleteStockEntryResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteStockEntryResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteStockEntryResponse Empty(string message)
        {
            return new SoftDeleteStockEntryResponse(false, message);
        }
    }
}
