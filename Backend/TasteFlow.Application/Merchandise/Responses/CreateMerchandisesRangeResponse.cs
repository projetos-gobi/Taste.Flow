using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Merchandise.Responses
{
    public record CreateMerchandisesRangeResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateMerchandisesRangeResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateMerchandisesRangeResponse Empty(string message)
        {
            return new CreateMerchandisesRangeResponse(false, message);
        }
    }
}
