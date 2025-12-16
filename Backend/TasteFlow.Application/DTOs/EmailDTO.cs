using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class EmailDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "emailStatusId")]
        public Guid EmailStatusId { get; set; }

        [DataMember(Name = "userId")]
        public Guid? UserId { get; set; }

        [DataMember(Name = "enterpriseId")]
        public Guid? EnterpriseId { get; set; }

        [DataMember(Name = "emailTemplateId")]
        public Guid? EmailTemplateId { get; set; }

        [DataMember(Name = "recipient")]
        public string? Recipient { get; set; }

        [DataMember(Name = "subject")]
        public string? Subject { get; set; }

        [DataMember(Name = "body")]
        public string? Body { get; set; }

        [DataMember(Name = "sentAt")]
        public DateTime? SentAt { get; set; }

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

        [DataMember(Name = "createdByNavigation")]
        public UsersDTO CreatedByNavigation { get; set; }

        [DataMember(Name = "deletedByNavigation")]
        public UsersDTO? DeletedByNavigation { get; set; }

        [DataMember(Name = "emailStatus")]
        public EmailStatusDTO EmailStatus { get; set; }

        [DataMember(Name = "emailTemplate")]
        public EmailTemplateDTO? EmailTemplate { get; set; }

        [DataMember(Name = "enterprise")]
        public EnterpriseDTO? Enterprise { get; set; }

        [DataMember(Name = "modifiedByNavigation")]
        public UsersDTO? ModifiedByNavigation { get; set; }

        [DataMember(Name = "user")]
        public UsersDTO? User { get; set; }
    }
}
