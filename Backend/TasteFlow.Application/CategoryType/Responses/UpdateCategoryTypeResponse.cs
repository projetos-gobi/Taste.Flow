using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.CategoryType.Responses
{
    public record UpdateCategoryTypeResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateCategoryTypeResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateCategoryTypeResponse Empty(string message)
        {
            return new UpdateCategoryTypeResponse(false, message);
        }
    }
}
