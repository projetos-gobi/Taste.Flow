using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.PaymentTerm.Responses;

namespace TasteFlow.Application.PaymentTerm.Queries
{
    public record GetAllPaymentTermsQuery : IRequest<IEnumerable<GetAllPaymentTermsResponse>>
    {
    }
}
