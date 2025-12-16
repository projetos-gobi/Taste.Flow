using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.ProductIntermediate.Responses
{
    public record CreateProductIntermediateResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateProductIntermediateResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateProductIntermediateResponse Empty(string message)
        {
            return new CreateProductIntermediateResponse(false, message);
        }
    }
}
