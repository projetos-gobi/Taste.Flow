using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Domain.Entities
{
    public class UserPasswordManagement
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? Code { get; set; }
        public bool MustChangePassword { get; set; }
        public DateTime? LastPasswordChange { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? DeletedOn { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? DeletedBy { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }

        public virtual Users User { get; set; }
    }
}
