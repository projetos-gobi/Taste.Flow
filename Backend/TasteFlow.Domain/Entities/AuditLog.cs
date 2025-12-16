using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class AuditLog
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public Guid? EnterpriseId { get; set; }

    public string Entity { get; set; } = null!;

    public Guid? EntityId { get; set; }

    public string? Details { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }
}
