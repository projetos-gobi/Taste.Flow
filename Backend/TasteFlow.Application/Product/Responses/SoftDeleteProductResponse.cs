using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Product.Responses
{
    public record SoftDeleteProductResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteProductResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteProductResponse Empty(string message)
        {
            return new SoftDeleteProductResponse(false, message);
        }
    }
}
