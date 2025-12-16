using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.ProductIntermediate.Request
{
    public record GetProductIntermediateByIdRequest
    {
        public Guid Id { get; set; }
    }
}
