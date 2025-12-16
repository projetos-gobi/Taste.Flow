using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Contracts.ProductComposition.Request;

namespace TasteFlow.Contracts.Product.Request
{
    public record CreateProductRequest
    {
        public Guid ProductCategoryTypeId { get; init; }
        public Guid CategoryId { get; init; }
        public Guid SubCategoryId { get; init; }
        public string Name { get; init; }
        public string Instruction { get; init; }
        public decimal Price { get; init; }
        public int Yield { get; init; }
        public decimal Multiplier { get; init; }
        public decimal MarginValue { get; set; }
        public decimal MarginPercent { get; set; }
        public IEnumerable<ProductCompositionRequest> ProductCompositions { get; set; }
    }
}
