using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Category.Request
{
    public record CreateCategoriesRangeRequest
    {
        public IEnumerable<CategoryRequest> Categories { get; set; }
    }
}
