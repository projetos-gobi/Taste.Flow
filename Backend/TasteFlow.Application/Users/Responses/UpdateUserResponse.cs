using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Users.Responses
{
    public record UpdateUserResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateUserResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateUserResponse Empty(string message)
        {
            return new UpdateUserResponse(false, message);
        }
    }
}
