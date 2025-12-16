using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.CategoryType.Request
{
    public record CreateCategoryTypesRangeRequest
    {
        public IEnumerable<CategoryTypeRequest> CategoryTypes { get; set; }
    }
}
