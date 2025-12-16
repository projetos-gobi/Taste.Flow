using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Merchandise.Responses
{
    public record SoftDeleteMerchandiseResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteMerchandiseResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteMerchandiseResponse Empty(string message)
        {
            return new SoftDeleteMerchandiseResponse(false, message);
        }
    }
}
