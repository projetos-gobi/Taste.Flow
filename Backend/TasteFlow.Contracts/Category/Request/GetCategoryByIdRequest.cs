using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Category.Request
{
    public record GetCategoryByIdRequest
    {
        public Guid Id { get; set; }
    }
}
