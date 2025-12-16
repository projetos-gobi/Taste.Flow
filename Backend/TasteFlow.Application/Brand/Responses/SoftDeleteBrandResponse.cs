using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Brand.Responses
{
    public record SoftDeleteBrandResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteBrandResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteBrandResponse Empty(string message)
        {
            return new SoftDeleteBrandResponse(false, message);
        }
    }
}
