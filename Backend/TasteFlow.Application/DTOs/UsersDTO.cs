using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class UsersDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "accessProfileId")]
        public Guid AccessProfileId { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; } = null!;

        [DataMember(Name = "emailAddress")]
        public string? EmailAddress { get; set; }

        [DataMember(Name = "contact")]
        public string? Contact { get; set; }

        [DataMember(Name = "passwordHash")]
        public string? PasswordHash { get; set; }

        [DataMember(Name = "passwordSalt")]
        public string? PasswordSalt { get; set; }

        [DataMember(Name = "mustChangePassword")]
        public bool MustChangePassword { get; set; }

        [DataMember(Name = "lastPasswordChange")]
        public DateTime? LastPasswordChange { get; set; }

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
