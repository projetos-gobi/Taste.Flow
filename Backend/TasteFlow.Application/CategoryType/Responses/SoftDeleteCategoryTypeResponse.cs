using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.CategoryType.Responses
{
    public record SoftDeleteCategoryTypeResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteCategoryTypeResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteCategoryTypeResponse Empty(string message)
        {
            return new SoftDeleteCategoryTypeResponse(false, message);
        }
    }
}
