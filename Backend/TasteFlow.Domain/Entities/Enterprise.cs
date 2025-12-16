using System;
using System.Collections.Generic;

namespace TasteFlow.Domain.Entities;

public partial class Enterprise
{
    public Guid Id { get; set; }

    public Guid? LicenseId { get; set; }

    public Guid? MainEnterpriseId { get; set; }

    public string? FantasyName { get; set; }

    public string? SocialReason { get; set; }

    public string? Cnpj { get; set; }

    public int? LicenseQuantity { get; set; }

    public bool HasUnlimitedLicenses { get; set; }

    public bool IsHeadOffice { get; set; }

    public string? StateRegistration { get; set; }

    public string? MunicipalRegistration { get; set; }

    public string? Observation { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public DateTime? DeletedOn { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? ModifiedBy { get; set; }

    public Guid? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsActive { get; set; }

    public ICollection<EnterpriseAddress> EnterpriseAddresses { get; set; } = new List<EnterpriseAddress>();
    public ICollection<EnterpriseContact> EnterpriseContacts { get; set; } = new List<EnterpriseContact>();
    public ICollection<LicenseManagement> LicenseManagements { get; set; } = new List<LicenseManagement>();
    public ICollection<UserEnterprise> UserEnterprises { get; set; } = new List<UserEnterprise>();
    public virtual License License { get; set; }
}
