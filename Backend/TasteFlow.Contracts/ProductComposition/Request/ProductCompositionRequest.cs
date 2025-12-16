using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.ProductComposition.Request
{
    public record ProductCompositionRequest
    {
        public Guid? Id { get; set; }
        public Guid? MerchandiseId { get; set; }
        public Guid? ProductIntermediateId { get; set; }
        public Guid UnitId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Yield { get; set; }
    }
}
