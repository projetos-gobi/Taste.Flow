using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Unit.Responses;

namespace TasteFlow.Application.SubCategory.Responses
{
    public class UpdateSubCategoryResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateSubCategoryResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateSubCategoryResponse Empty(string message)
        {
            return new UpdateSubCategoryResponse(false, message);
        }
    }
}
