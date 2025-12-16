using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.StockEntryAttachment.Responses
{
    public record GetFileUrlStockEntryAttachmentResponse
    {
        public string FileUrl { get; set; }
        public DateTime Expiry { get; set; }
    }
}
