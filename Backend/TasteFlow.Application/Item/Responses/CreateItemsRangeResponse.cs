using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Item.Responses
{
    public record CreateItemsRangeResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateItemsRangeResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateItemsRangeResponse Empty(string message)
        {
            return new CreateItemsRangeResponse(false, message);
        }
    }
}
