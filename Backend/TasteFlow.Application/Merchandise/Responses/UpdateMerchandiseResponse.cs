using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Merchandise.Responses
{
    public record UpdateMerchandiseResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateMerchandiseResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateMerchandiseResponse Empty(string message)
        {
            return new UpdateMerchandiseResponse(false, message);
        }
    }
}
