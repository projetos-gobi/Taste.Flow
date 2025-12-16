using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.StockEntry.Responses
{
    public record GetStockEntriesPagedResponse
    {
        public Guid Id { get; init; }
        public Guid SupplierId { get; init; }
        public Guid PaymentTypeId { get; init; }
        public Guid PaymentTermId { get; init; }
        public string SupplierName { get; init; }
        public string PaymentTypeName { get; init; }
        public DateTime? PurchaseDate { get; init; }
        public DateTime? ExpectedDeliveryDate { get; init; }
        public decimal TotalAmount { get; init; }
        public bool IsDeliveryCompleted { get; init; }
        public int StockEntryAttachmentCount { get; init; }
    }
}
