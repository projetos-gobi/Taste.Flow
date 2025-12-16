using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Category.Responses
{
    public record UpdateCategoryResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateCategoryResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateCategoryResponse Empty(string message)
        {
            return new UpdateCategoryResponse(false, message);
        }
    }
}
