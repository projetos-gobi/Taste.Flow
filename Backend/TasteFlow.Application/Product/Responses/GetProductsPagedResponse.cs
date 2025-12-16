using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Product.Responses
{
    public record GetProductsPagedResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string CategoryName { get; set; }
        public string SubCategoryName { get; set; }
        public decimal Price { get; set; }
        public decimal Yield { get; set; }
        public decimal MarginValue { get; set; }
        public decimal MarginPercent { get; set; }
    }
}
