using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Common.Filters;

namespace TasteFlow.Contracts.StockEntry.Request
{
    public record GetStockEntriesPagedRequest
    {
        public StockEntryFilter Filter { get; init; }
        public PageQuery Query { get; init; }
    }
}
