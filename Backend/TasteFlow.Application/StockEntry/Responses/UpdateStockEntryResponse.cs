using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.StockEntry.Responses
{
    public record UpdateStockEntryResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateStockEntryResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateStockEntryResponse Empty(string message)
        {
            return new UpdateStockEntryResponse(false, message);
        }
    }
}
