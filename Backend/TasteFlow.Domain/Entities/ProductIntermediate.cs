using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class ProductIntermediate
{
    public Guid Id { get; set; }

    public Guid EnterpriseId { get; set; }

    public Guid? CategoryId { get; set; }

    public Guid? SubCategoryId { get; set; }

    public Guid? UnitId { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Instruction { get; set; } = null!;

    public decimal? Price { get; set; }

    public decimal Yield { get; set; }

    public int PreparationTime { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }

    public virtual Enterprise Enterprise { get; set; }

    public virtual Category Category { get; set; }

    public virtual SubCategory SubCategory { get; set; }

    public virtual Unit Unit { get; set; }

    public ICollection<ProductIntermediateComposition> ProductIntermediateCompositions { get; set; } = new List<ProductIntermediateComposition>();
}
