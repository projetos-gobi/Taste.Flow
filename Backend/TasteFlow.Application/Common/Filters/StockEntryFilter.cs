using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Common.Filters
{
    public class StockEntryFilter
    {
        public DateTime? PurchaseDate { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? SearchQuery { get; set; }
    }
}
