using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.CategoryType.Request
{
    public record UpdateCategoryTypeRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
