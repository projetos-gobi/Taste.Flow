using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.StockEntryAttachment.Request
{
    public record GetFileUrlStockEntryAttachmentRequest
    {
        public Guid Id { get; init; }
    }
}
