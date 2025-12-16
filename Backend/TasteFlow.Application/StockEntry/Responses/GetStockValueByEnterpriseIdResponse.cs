using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.StockEntry.Responses
{
    public record GetStockValueByEnterpriseIdResponse
    {
        public Guid MerchandiseId { get; init; }
        public string MerchandiseName { get; init; } = string.Empty;
        public decimal AverageValue { get; init; }
    }
}
