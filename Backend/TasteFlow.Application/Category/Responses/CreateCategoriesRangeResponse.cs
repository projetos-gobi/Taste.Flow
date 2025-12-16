using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Category.Responses
{
    public record CreateCategoriesRangeResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateCategoriesRangeResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateCategoriesRangeResponse Empty(string message)
        {
            return new CreateCategoriesRangeResponse(false, message);
        }
    }
}
