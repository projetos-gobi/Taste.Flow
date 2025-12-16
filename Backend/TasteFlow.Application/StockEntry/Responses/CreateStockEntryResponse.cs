using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.StockEntry.Responses
{
    public record CreateStockEntryResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateStockEntryResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateStockEntryResponse Empty(string message)
        {
            return new CreateStockEntryResponse(false, message);
        }
    }
}
