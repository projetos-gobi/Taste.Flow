using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.ProductIntermediateComposition.Responses
{
    public record ProductIntermediateCompositionResponse
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
        public Guid ProductIntermediateId { get; set; }
        public Guid? MerchandiseId { get; set; }
        public Guid UnitId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Yield { get; set; }
        public decimal UnitCost { get; set; }
        public decimal TotalCost { get; set; }
    }
}
