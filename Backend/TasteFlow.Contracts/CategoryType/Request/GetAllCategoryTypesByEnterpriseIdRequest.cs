using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.CategoryType.Request
{
    public record GetAllCategoryTypesByEnterpriseIdRequest
    {
        public Guid EnterpriseId { get; set; }
    }
}
