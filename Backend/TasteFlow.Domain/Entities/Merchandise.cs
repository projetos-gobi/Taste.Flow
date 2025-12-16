using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class Merchandise
{
    public Guid Id { get; set; }

    public Guid EnterpriseId { get; set; }

    public Guid ItemId { get; set; }

    public Guid? BrandId { get; set; }

    public Guid? ProductTypeId { get; set; }

    public Guid CategoryId { get; set; }

    public Guid UnitId { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }

    public virtual Enterprise Enterprise { get; set; }

    public virtual Item Item { get; set; }

    public virtual Brand Brand { get; set; }

    public virtual ProductType ProductType { get; set; }

    public virtual Category Category { get; set; }

    public virtual Unit Unit { get; set; }
}
