using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Common.Filters
{
    public class ProductFilter
    {
        public Guid? CategoryId { get; set; }
        public Guid? SubCategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public decimal? MinMargin { get; set; }
        public decimal? MaxMargin { get; set; }
        public bool? IsActive { get; set; }
        public string? SearchQuery { get; set; }
    }
}
