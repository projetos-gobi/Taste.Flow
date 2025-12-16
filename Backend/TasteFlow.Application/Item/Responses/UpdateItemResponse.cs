using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Item.Responses
{
    public record UpdateItemResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateItemResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateItemResponse Empty(string message)
        {
            return new UpdateItemResponse(false, message);
        }
    }
}
