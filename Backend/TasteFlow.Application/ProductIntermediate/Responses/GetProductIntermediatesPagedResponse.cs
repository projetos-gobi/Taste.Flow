using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.ProductIntermediate.Responses
{
    public record GetProductIntermediatesPagedResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string CategoryName { get; set; }
        public string SubCategoryName { get; set; }
        public decimal Yield { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
    }
}
