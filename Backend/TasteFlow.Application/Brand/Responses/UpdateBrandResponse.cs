using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Brand.Responses
{
    public record UpdateBrandResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateBrandResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateBrandResponse Empty(string message)
        {
            return new UpdateBrandResponse(false, message);
        }
    }
}
