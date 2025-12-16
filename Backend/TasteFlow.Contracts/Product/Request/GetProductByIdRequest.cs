using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Product.Request
{
    public record GetProductByIdRequest
    {
        public Guid Id { get; set; }
    }
}
