using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Contracts.ProductIntermediateComposition.Request;

namespace TasteFlow.Contracts.ProductIntermediate.Request
{
    public record CreateProductIntermediateRequest
    {
        public Guid? CategoryId { get; set; }
        public Guid? SubCategoryId { get; set; }
        public Guid? UnitId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Instruction { get; set; }
        public decimal Yield { get; set; }
        public decimal Price { get; set; }
        public int PreparationTime { get; set; }
        public IEnumerable<ProductIntermediateCompositionRequest> ProductIntermediateCompositions { get; set; }
    }
}
