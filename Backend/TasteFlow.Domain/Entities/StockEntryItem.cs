using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class StockEntryItem
{
    public Guid Id { get; set; }

    public Guid EnterpriseId { get; set; }

    public Guid StockEntryId { get; set; }

    public Guid MerchandiseId { get; set; }
    
    public Guid CategoryId { get; set; }
    
    public Guid UnitId { get; set; }

    public decimal Quantity { get; set; }

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

    public virtual StockEntry StockEntry { get; set; }

    public virtual Merchandise Merchandise { get; set; }

    public virtual Category Category { get; set; }

    public virtual Unit Unit { get; set; }
}
