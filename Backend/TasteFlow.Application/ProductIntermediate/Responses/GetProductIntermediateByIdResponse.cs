using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.ProductIntermediateComposition.Responses;

namespace TasteFlow.Application.ProductIntermediate.Responses
{
    public record GetProductIntermediateByIdResponse
    {
        public Guid Id { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? SubCategoryId { get; set; }
        public Guid? UnitId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Instruction { get; set; }
        public decimal Yield { get; set; }
        public int PreparationTime { get; set; }
        public IEnumerable<ProductIntermediateCompositionResponse> ProductIntermediateCompositions { get; set; }
    }
}
