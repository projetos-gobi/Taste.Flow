using MediatR;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.PaymentType.Responses;

namespace TasteFlow.Application.PaymentType.Queries
{
    public record GetAllPaymentTypesByEnterpriseIdQuery : IRequest<IEnumerable<GetAllPaymentTypesByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
