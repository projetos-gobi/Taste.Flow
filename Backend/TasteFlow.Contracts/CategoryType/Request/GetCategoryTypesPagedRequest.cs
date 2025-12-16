using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;

namespace TasteFlow.Contracts.CategoryType.Request
{
    public record GetCategoryTypesPagedRequest
    {
        public PageQuery Query { get; set; }
    }
}
