using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Item.Responses
{
    public record SoftDeleteItemResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteItemResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteItemResponse Empty(string message)
        {
            return new SoftDeleteItemResponse(false, message);
        }
    }
}
