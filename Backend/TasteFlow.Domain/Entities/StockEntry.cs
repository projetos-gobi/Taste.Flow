using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class StockEntry
{
    public Guid Id { get; set; }

    public Guid EnterpriseId { get; set; }

    public Guid SupplierId { get; set; }

    public Guid PaymentTypeId { get; set; }
    
    public Guid PaymentTermId { get; set; }

    public DateTime? PurchaseDate { get; set; }

    public DateTime? ExpectedDeliveryDate { get; set; }

    public string ReceivedBy { get; set; } = null!;

    public bool IsDeliveryCompleted { get; set; } 

    public string? InvoiceNumber { get; set; }

    public decimal TotalAmount { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }

    public virtual Enterprise Enterprise { get; set; }

    public virtual Supplier Supplier { get; set; }

    public virtual PaymentType PaymentType { get; set; }

    public virtual PaymentTerm PaymentTerm { get; set; }

    public virtual ICollection<StockEntryItem> StockEntryItems { get; set; } = new List<StockEntryItem>();

    public virtual ICollection<StockEntryAttachment> StockEntryAttachments { get; set; } = new List<StockEntryAttachment>();
}
