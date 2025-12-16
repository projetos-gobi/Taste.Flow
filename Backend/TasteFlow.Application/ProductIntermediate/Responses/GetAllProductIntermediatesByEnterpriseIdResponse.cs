using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.ProductIntermediate.Responses
{
    public record GetAllProductIntermediatesByEnterpriseIdResponse
    {
        public Guid Id { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? SubCategoryId { get; set; }
        public Guid? UnitId { get; set; }
        public string Name { get; set; }
        public decimal Yield { get; set; }
        public decimal Price { get; set; }
    }
}
