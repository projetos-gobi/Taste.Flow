using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Supplier.Responses
{
    public record SoftDeleteSupplierResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteSupplierResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteSupplierResponse Empty(string message)
        {
            return new SoftDeleteSupplierResponse(false, message);
        }
    }
}
