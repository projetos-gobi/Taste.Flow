using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Supplier.Responses
{
    public record CheckSupplierExistResponse
    {
        public Guid Id { get; set; }
        public string FantasyName { get; set; }
        public string Cnpj { get; set; }
    }
}
