using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class Users
{
    public Guid Id { get; set; }

    public Guid AccessProfileId { get; set; }

    public string Name { get; set; } = null!;

    public string? EmailAddress { get; set; }

    public string? Contact { get; set; }

    public string? PasswordHash { get; set; }

    public string? PasswordSalt { get; set; }

    public bool MustChangePassword { get; set; }

    public DateTime? LastPasswordChange { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }

    public virtual AccessProfile AccessProfile { get; set; }
    public ICollection<UserEnterprise> UserEnterprises { get; set; } = new List<UserEnterprise>();
    public ICollection<UserPasswordManagement> UserPasswordManagements { get; set; } = new List<UserPasswordManagement>();
}
