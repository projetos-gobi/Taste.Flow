using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class Product
{
    public Guid Id { get; set; }

    public Guid EnterpriseId { get; set; }

    public Guid CategoryId { get; set; }

    public Guid ProductCategoryTypeId { get; set; }

    public Guid SubCategoryId { get; set; }

    public string Name { get; set; } = null!;

    public string Instruction { get; set; }

    public decimal? Price { get; set; }

    public int Yield { get; set; }

    public decimal Multiplier { get; set; }

    public decimal? MarginValue { get; set; }

    public decimal? MarginPercent { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }

    public virtual Enterprise Enterprise { get; set; }

    public virtual ProductCategoryType ProductCategoryType { get; set; }

    public virtual Category Category { get; set; }

    public virtual SubCategory SubCategory { get; set; }

    public ICollection<ProductComposition> ProductCompositions { get; set; } = new List<ProductComposition>();
}
