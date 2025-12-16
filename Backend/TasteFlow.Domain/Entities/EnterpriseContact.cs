using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Domain.Entities
{
    public partial class EnterpriseContact
    {
        public Guid Id { get; set; }
        public Guid? EnterpriseId { get; set; }
        public string? Telephone { get; set; }
        public string? EmailAddress { get; set; }
        public string? Responsible { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? DeletedOn { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? DeletedBy { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }

        public virtual Enterprise Enterprise { get; set; }
    }
}
