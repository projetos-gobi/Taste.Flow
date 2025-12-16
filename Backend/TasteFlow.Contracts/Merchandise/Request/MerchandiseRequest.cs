using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Merchandise.Request
{
    public record MerchandiseRequest
    {
        public Guid ItemId { get; set; }
        public Guid? BrandId { get; set; }
        public Guid? ProductTypeId { get; set; }
        public Guid CategoryId { get; set; }
        public Guid UnitId { get; set; }
    }
}
