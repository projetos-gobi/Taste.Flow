using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Supplier.Request
{
    public record SupplierPaymentTypeRequest
    {
        public Guid? Id { get; set; }
        public Guid PaymentTypeId { get; set; }
    }
}
