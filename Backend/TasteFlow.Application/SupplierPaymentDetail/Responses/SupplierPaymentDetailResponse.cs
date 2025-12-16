using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.SupplierPaymentDetail.Responses
{
    public record SupplierPaymentDetailResponse
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
        public Guid SupplierId { get; set; }
        public string Agency { get; set; }
        public string BankAccountNumber { get; set; }
        public string PixKey { get; set; }
    }
}
