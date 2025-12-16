using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Supplier.Responses
{
    public record CreateSupplierResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateSupplierResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateSupplierResponse Empty(string message)
        {
            return new CreateSupplierResponse(false, message);
        }
    }
}
