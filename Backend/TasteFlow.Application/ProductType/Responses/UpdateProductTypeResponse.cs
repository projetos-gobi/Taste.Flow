using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.ProductType.Responses
{
    public record UpdateProductTypeResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateProductTypeResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateProductTypeResponse Empty(string message)
        {
            return new UpdateProductTypeResponse(false, message);
        }
    }
}
