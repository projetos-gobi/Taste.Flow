using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class LicenseManagement
{
    public Guid Id { get; set; }

    public Guid? LicenseId { get; set; }

    public Guid? EnterpriseId { get; set; }

    public string LicenseCode { get; set; }

    public DateTime ExpirationDate { get; set; }

    public bool IsIndefinite { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }
    public virtual Enterprise Enterprise { get; set; }
    public virtual License License { get; set; }
}
