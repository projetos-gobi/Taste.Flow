using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Unit.Responses
{
    public record CreateUnitsRangeResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }


        public CreateUnitsRangeResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateUnitsRangeResponse Empty(string message)
        {
            return new CreateUnitsRangeResponse(false, message);
        }
    }
}
