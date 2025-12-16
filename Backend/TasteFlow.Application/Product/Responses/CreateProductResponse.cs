using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Product.Responses
{
    public record CreateProductResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateProductResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateProductResponse Empty(string message)
        {
            return new CreateProductResponse(false, message);
        }
    }
}
