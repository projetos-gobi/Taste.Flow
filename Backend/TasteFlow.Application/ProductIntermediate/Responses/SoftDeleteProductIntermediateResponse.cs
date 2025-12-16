using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.ProductIntermediate.Responses
{
    public record SoftDeleteProductIntermediateResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteProductIntermediateResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteProductIntermediateResponse Empty(string message)
        {
            return new SoftDeleteProductIntermediateResponse(false, message);
        }
    }
}
