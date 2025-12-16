using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Users.Responses
{
    public record CreateUsersRangeResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }


        public CreateUsersRangeResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateUsersRangeResponse Empty(string message)
        {
            return new CreateUsersRangeResponse(false, message);
        }
    }
}
