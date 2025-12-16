using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Common.Filters;
using TasteFlow.Application.StockEntry.Responses;

namespace TasteFlow.Application.StockEntry.Queries
{
    public record GetStockEntriesPagedQuery : IRequest<PagedResult<GetStockEntriesPagedResponse>>
    {
        public PageQuery Query { get; set; }
        public StockEntryFilter Filter { get; init; }
        public Guid EnterpriseId { get; set; }
    }
}
