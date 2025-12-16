using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Unit.Responses
{
    public record UpdateUnitResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateUnitResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateUnitResponse Empty(string message)
        {
            return new UpdateUnitResponse(false, message);
        }
    }
}
