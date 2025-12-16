using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.ProductIntermediate.Responses
{
    public record UpdateProductIntermediateResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateProductIntermediateResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateProductIntermediateResponse Empty(string message)
        {
            return new UpdateProductIntermediateResponse(false, message);
        }
    }
}
