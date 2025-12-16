using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Unit.Responses;

namespace TasteFlow.Application.SubCategory.Responses
{
    public record SoftDeleteSubCategoryResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteSubCategoryResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteSubCategoryResponse Empty(string message)
        {
            return new SoftDeleteSubCategoryResponse(false, message);
        }
    }
}
