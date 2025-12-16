using System.Runtime.Serialization;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class EnterpriseDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "licenseId")]
        public Guid? LicenseId { get; set; }

        [DataMember(Name = "mainEnterpriseId")]
        public Guid? MainEnterpriseId { get; set; }

        [DataMember(Name = "fantasyName")]
        public string? FantasyName { get; set; }

        [DataMember(Name = "socialReason")]
        public string? SocialReason { get; set; }

        [DataMember(Name = "cnpj")]
        public string? Cnpj { get; set; }

        [DataMember(Name = "licenseQuantity")]
        public int? LicenseQuantity { get; set; }

        [DataMember(Name = "isHeadOffice")]
        public bool IsHeadOffice { get; set; }

        [DataMember(Name = "stateRegistration")]
        public string? StateRegistration { get; set; }

        [DataMember(Name = "municipalRegistration")]
        public string? MunicipalRegistration { get; set; }

        [DataMember(Name = "observation")]
        public string? Observation { get; set; }

        [DataMember(Name = "createdOn")]
        public DateTime CreatedOn { get; set; }

        [DataMember(Name = "modifiedOn")]
        public DateTime? ModifiedOn { get; set; }

        [DataMember(Name = "deletedOn")]
        public DateTime? DeletedOn { get; set; }

        [DataMember(Name = "createdBy")]
        public Guid CreatedBy { get; set; }

        [DataMember(Name = "modifiedBy")]
        public Guid? ModifiedBy { get; set; }

        [DataMember(Name = "deletedBy")]
        public Guid? DeletedBy { get; set; }

        [DataMember(Name = "isDeleted")]
        public bool IsDeleted { get; set; }

        [DataMember(Name = "isActive")]
        public bool IsActive { get; set; }

        [DataMember(Name = "enterpriseAddress")]
        public List<EnterpriseAddressDTO> EnterpriseAddresses { get; set; } = new List<EnterpriseAddressDTO>();

        [DataMember(Name = "enterpriseContact")]
        public List<EnterpriseContactDTO> EnterpriseContacts { get; set; } = new List<EnterpriseContactDTO>();
    }
}
