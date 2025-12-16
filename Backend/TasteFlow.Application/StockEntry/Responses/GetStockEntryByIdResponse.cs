using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.StockEntryAttachment.Responses;
using TasteFlow.Application.StockEntryItem.Responses;

namespace TasteFlow.Application.StockEntry.Responses
{
    public record GetStockEntryByIdResponse
    {
        public Guid Id { get; init; }
        public Guid SupplierId { get; init; }
        public Guid PaymentTypeId { get; init; }
        public Guid PaymentTermId { get; init; }
        public string ReceivedBy { get; init; }
        public bool IsDeliveryCompleted { get; init; }
        public string InvoiceNumber { get; init; }
        public DateTime? PurchaseDate { get; init; }
        public DateTime? ExpectedDeliveryDate { get; init; }
        public decimal TotalAmount { get; init; }
        public IEnumerable<StockEntryItemResponse> StockEntryItems { get; set; }
        public IEnumerable<StockEntryAttachmentResponse> StockEntryAttachments { get; set; }
    }
}
