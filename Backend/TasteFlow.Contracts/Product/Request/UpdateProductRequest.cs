using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Contracts.ProductComposition.Request;

namespace TasteFlow.Contracts.Product.Request
{
    public record UpdateProductRequest
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public Guid SubCategoryId { get; set; }
        public string Name { get; set; }
        public string Instruction { get; set; }
        public decimal Price { get; set; }
        public int Yield { get; set; }
        public decimal Multiplier { get; set; }
        public IEnumerable<ProductCompositionRequest> ProductCompositions { get; set; }
    }
}
