using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.ProductType.Request
{
    public record GetAllProductTypesByEnterpriseIdRequest
    {
        public Guid EnterpriseId { get; set; }
    }
}
