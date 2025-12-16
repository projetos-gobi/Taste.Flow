using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class Supplier
{
    public Guid Id { get; set; }

    public Guid EnterpriseId { get; set; }

    public Guid CategoryId { get; set; }

    public Guid SubCategoryId { get; set; }

    public string? FantasyName { get; set; }

    public string? SocialReason { get; set; }

    public string? Cnpj { get; set; }

    public string? Telephone { get; set; }

    public string? Address { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

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

    public virtual SupplierPaymentDetail SupplierPaymentDetail { get; set; }

    public virtual ICollection<SupplierPaymentType> SupplierPaymentTypes { get; set; } = new List<SupplierPaymentType>();
}
