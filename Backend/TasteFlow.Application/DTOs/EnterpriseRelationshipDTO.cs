using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class EnterpriseRelationshipDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "mainEnterpriseId")]
        public Guid MainEnterpriseId { get; set; }

        [DataMember(Name = "branchEnterpriseId")]
        public Guid BranchEnterpriseId { get; set; }

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

        [DataMember(Name = "branchEnterprise")]
        public EnterpriseDTO BranchEnterprise { get; set; }

        [DataMember(Name = "createdByNavigation")]
        public UsersDTO CreatedByNavigation { get; set; }

        [DataMember(Name = "deletedByNavigation")]
        public UsersDTO? DeletedByNavigation { get; set; }

        [DataMember(Name = "mainEnterprise")]
        public EnterpriseDTO MainEnterprise { get; set; }

        [DataMember(Name = "modifiedByNavigation")]
        public UsersDTO? ModifiedByNavigation { get; set; }
    }
}
