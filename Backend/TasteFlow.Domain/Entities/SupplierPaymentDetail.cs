using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Domain.Entities
{
    public partial class SupplierPaymentDetail
    {
        public Guid Id { get; set; }

        public Guid EnterpriseId { get; set; }

        public Guid SupplierId { get; set; }

        public string? Agency { get; set; }

        public string? BankAccountNumber { get; set; }

        public string? PixKey { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public DateTime? DeletedOn { get; set; }

        public Guid CreatedBy { get; set; }

        public Guid? ModifiedBy { get; set; }

        public Guid? DeletedBy { get; set; }

        public bool IsDeleted { get; set; }

        public bool IsActive { get; set; }

        public virtual Enterprise Enterprise { get; set; }

        public virtual Supplier Supplier { get; set; }
    }
}
