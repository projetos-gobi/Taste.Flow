using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Contracts.StockEntryAttachment.Request;
using TasteFlow.Contracts.StockEntryItem.Request;

namespace TasteFlow.Contracts.StockEntry.Request
{
    public record UpdateStockEntryRequest
    {
        public Guid Id { get; init; }
        public Guid SupplierId { get; init; }
        public Guid PaymentTypeId { get; init; }
        public Guid PaymentTermId { get; init; }
        public DateTime? PurchaseDate { get; init; }
        public DateTime? ExpectedDeliveryDate { get; init; }
        public string ReceivedBy { get; init; }
        public bool IsDeliveryCompleted { get; init; }
        public string? InvoiceNumber { get; init; }
        public decimal TotalAmount { get; init; }
        public IEnumerable<StockEntryItemRequest> StockEntryItems { get; init; }
        public IEnumerable<StockEntryAttachmentRequest> StockEntryAttachments { get; init; }
    }
}
