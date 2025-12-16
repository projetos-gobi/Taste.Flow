using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Supplier.Responses
{
    public record UpdateSupplierResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateSupplierResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateSupplierResponse Empty(string message)
        {
            return new UpdateSupplierResponse(false, message);
        }
    }
}
