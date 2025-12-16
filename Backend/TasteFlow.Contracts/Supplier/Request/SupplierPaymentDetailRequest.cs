using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Supplier.Request
{
    public record SupplierPaymentDetailRequest
    {
        public Guid? Id { get; set; }
        public string Agency { get; set; }
        public string BankAccountNumber { get; set; }
        public string PixKey { get; set; }
    }
}
