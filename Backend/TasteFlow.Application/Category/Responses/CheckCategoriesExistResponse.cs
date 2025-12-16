using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Category.Responses
{
    public record CheckCategoriesExistResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
