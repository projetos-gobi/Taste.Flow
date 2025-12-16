using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.CategoryType.Request
{
    public record SoftDeleteCategoryTypeRequest
    {
        public Guid Id { get; set; }
    }
}
