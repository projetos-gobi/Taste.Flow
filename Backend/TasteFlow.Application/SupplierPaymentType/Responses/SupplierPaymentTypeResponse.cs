using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.SupplierPaymentType.Responses
{
    public record SupplierPaymentTypeResponse
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
        public Guid SupplierId { get; set; }
        public Guid PaymentTypeId { get; set; }
        public string PaymentTypeName { get; set; }
    }
}
