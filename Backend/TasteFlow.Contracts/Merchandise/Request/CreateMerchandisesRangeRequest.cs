using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Merchandise.Request
{
    public record CreateMerchandisesRangeRequest
    {
        public IEnumerable<MerchandiseRequest> Merchandises { get; set; }
    }
}
