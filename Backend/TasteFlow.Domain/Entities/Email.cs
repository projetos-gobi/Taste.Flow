using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class Email
{
    public Guid Id { get; set; }

    public Guid EmailStatusId { get; set; }

    public Guid? UserId { get; set; }

    public Guid? EnterpriseId { get; set; }

    public Guid? EmailTemplateId { get; set; }

    public string? Recipient { get; set; }

    public string? Subject { get; set; }

    public string? Body { get; set; }

    public DateTime? SentAt { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }
}
