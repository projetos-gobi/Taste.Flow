using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.SubCategory.Request
{
    public record SoftDeleteSubCategoryRequest
    {
        public Guid Id { get; init; }
    }
}
