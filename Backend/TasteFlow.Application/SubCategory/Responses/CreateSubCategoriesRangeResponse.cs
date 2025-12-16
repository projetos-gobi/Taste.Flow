using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.SubCategory.Responses
{
    public record CreateSubCategoriesRangeResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }


        public CreateSubCategoriesRangeResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateSubCategoriesRangeResponse Empty(string message)
        {
            return new CreateSubCategoriesRangeResponse(false, message);
        }
    }
}
