using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.PaymentType.Request
{
    public record GetAllPaymentTypesByEnterpriseIdRequest
    {
        public Guid EnterpriseId { get; set; }
    }
}
