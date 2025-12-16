using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Supplier.Responses;

namespace TasteFlow.Application.Supplier.Queries
{
    public record CheckSupplierExistQuery : IRequest<IEnumerable<CheckSupplierExistResponse>>
    {
        public string FantasyName { get; set; }
        public string Cnpj { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
