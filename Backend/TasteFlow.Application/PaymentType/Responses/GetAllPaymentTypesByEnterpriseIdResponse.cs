using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.PaymentType.Responses
{
    public record GetAllPaymentTypesByEnterpriseIdResponse
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
        public string Name { get; set; }
    }
}
