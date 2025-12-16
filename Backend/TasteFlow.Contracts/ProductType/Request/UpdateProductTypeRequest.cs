using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.ProductType.Request
{
    public record UpdateProductTypeRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
