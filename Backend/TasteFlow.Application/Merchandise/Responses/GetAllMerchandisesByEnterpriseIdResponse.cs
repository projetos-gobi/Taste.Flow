using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Merchandise.Responses
{
    public record GetAllMerchandisesByEnterpriseIdResponse
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
        public Guid ItemId { get; set; }
        public Guid BrandId { get; set; }
        public Guid? ProductTypeId { get; set; }
        public Guid CategoryId { get; set; }
        public Guid UnitId { get; set; }
        public string ItemName { get; set; }
        public string BrandName { get; set; }
        public string ProductTypeName { get; set; }
        public string Name { get; set; }
    }
}
