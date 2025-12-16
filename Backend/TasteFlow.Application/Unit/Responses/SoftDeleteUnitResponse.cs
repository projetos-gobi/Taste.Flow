using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Users.Responses;

namespace TasteFlow.Application.Unit.Responses
{
    public record SoftDeleteUnitResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteUnitResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteUnitResponse Empty(string message)
        {
            return new SoftDeleteUnitResponse(false, message);
        }
    }
}
