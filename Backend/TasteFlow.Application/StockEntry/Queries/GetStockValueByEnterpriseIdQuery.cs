using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.StockEntry.Responses;

namespace TasteFlow.Application.StockEntry.Queries
{
    public record GetStockValueByEnterpriseIdQuery : IRequest<IEnumerable<GetStockValueByEnterpriseIdResponse>>
    {
        public Guid EnterpriseId { get; set; }
    }
}
