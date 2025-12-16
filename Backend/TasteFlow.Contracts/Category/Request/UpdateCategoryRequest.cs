using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Category.Request
{
    public record UpdateCategoryRequest
    {
        public Guid Id { get; set; }
        public Guid CategoryTypeId { get; set; }
        public string Name { get; set; }
    }
}
