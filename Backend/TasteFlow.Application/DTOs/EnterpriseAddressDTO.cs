using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class EnterpriseAddressDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "enterpriseId")]
        public Guid? EnterpriseId { get; set; }

        [DataMember(Name = "postalCode")]
        public string? PostalCode { get; set; }

        [DataMember(Name = "street")]
        public string? Street { get; set; }

        [DataMember(Name = "number")]
        public string? Number { get; set; }

        [DataMember(Name = "complement")]
        public string? Complement { get; set; }

        [DataMember(Name = "district")]
        public string? District { get; set; }

        [DataMember(Name = "city")]
        public string? City { get; set; }

        [DataMember(Name = "state")]
        public string? State { get; set; }

        [DataMember(Name = "latitude")]
        public double? Latitude { get; set; }

        [DataMember(Name = "longitude")]
        public double? Longitude { get; set; }

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
    }
}
