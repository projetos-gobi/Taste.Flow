using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Supplier.Request
{
    public record CheckSupplierExistRequest
    {
        public string FantasyName { get; set; }
        public string Cnpj { get; set; }
    }
}
