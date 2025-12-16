using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.CategoryType.Responses
{
    public record CreateCategoryTypesRangeResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateCategoryTypesRangeResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateCategoryTypesRangeResponse Empty(string message)
        {
            return new CreateCategoryTypesRangeResponse(false, message);
        }
    }
}
