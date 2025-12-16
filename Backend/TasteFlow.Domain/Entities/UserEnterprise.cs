using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class UserEnterprise
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid EnterpriseId { get; set; }

    public Guid? LicenseManagementId { get; set; }

    public Guid? ProfileTypeId { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }

    public virtual Users User { get; set; }

    public virtual Enterprise Enterprise { get; set; }

    public virtual LicenseManagement LicenseManagement { get; set; }

    public virtual ProfileType ProfileType { get; set; }
}
