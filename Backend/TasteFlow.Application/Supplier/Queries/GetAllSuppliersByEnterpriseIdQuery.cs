using MediatR;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Supplier.Responses;

namespace TasteFlow.Application.Supplier.Queries
{
    public record GetAllSuppliersByEnterpriseIdQuery : IRequest<IEnumerable<GetAllSuppliersByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
