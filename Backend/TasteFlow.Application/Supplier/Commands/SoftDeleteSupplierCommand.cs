using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Supplier.Responses;

namespace TasteFlow.Application.Supplier.Commands
{
    public record SoftDeleteSupplierCommand : IRequest<SoftDeleteSupplierResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
