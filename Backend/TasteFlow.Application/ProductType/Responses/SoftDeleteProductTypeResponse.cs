using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Item.Responses;

namespace TasteFlow.Application.ProductType.Responses
{
    public record SoftDeleteProductTypeResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteProductTypeResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteProductTypeResponse Empty(string message)
        {
            return new SoftDeleteProductTypeResponse(false, message);
        }
    }
}
