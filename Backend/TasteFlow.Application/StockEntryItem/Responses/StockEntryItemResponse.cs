using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.StockEntryItem.Responses
{
    public record StockEntryItemResponse
    {
        public Guid Id { get; init; }
        public Guid StockEntryId { get; init; }
        public Guid MerchandiseId { get; init; }
        public Guid CategoryId { get; init; }
        public Guid UnitId { get; init; }
        public decimal Quantity { get; init; }
        public decimal TotalAmount { get; init; }
    }
}
