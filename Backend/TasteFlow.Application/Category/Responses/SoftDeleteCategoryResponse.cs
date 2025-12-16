using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Category.Responses
{
    public record SoftDeleteCategoryResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteCategoryResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteCategoryResponse Empty(string message)
        {
            return new SoftDeleteCategoryResponse(false, message);
        }
    }
}
