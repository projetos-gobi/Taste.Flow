using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Product.Responses
{
    public record UpdateProductResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateProductResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateProductResponse Empty(string message)
        {
            return new UpdateProductResponse(false, message);
        }
    }
}
