using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class ProductIntermediateComposition
{
    public Guid Id { get; set; }

    public Guid EnterpriseId { get; set; }

    public Guid ProductIntermediateId { get; set; }

    public Guid? MerchandiseId { get; set; }

    public Guid UnitId { get; set; }

    public decimal Quantity { get; set; }

    public decimal Yield { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }

    public virtual Enterprise Enterprise { get; set; }

    public virtual ProductIntermediate ProductIntermediate { get; set; }

    public virtual Merchandise Merchandise { get; set; }

    public virtual Unit Unit { get; set; }
}
