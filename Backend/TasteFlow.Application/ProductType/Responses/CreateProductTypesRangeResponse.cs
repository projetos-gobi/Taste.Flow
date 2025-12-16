using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.ProductType.Responses
{
    public record CreateProductTypesRangeResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateProductTypesRangeResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateProductTypesRangeResponse Empty(string message)
        {
            return new CreateProductTypesRangeResponse(false, message);
        }
    }
}
