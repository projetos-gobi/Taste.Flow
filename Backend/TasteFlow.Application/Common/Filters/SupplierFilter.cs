using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Common.Filters
{
    public class SupplierFilter
    {
        public Guid? CategoryId { get; set; }
        public Guid? PaymentTypeId { get; set; }
        public string? SearchQuery { get; set; }
    }
}
