using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Brand.Responses
{
    public record CreateBrandsRangeResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateBrandsRangeResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateBrandsRangeResponse Empty(string message)
        {
            return new CreateBrandsRangeResponse(false, message);
        }
    }
}
