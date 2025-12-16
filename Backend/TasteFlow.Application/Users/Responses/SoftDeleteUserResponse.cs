using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Users.Responses
{
    public record SoftDeleteUserResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteUserResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteUserResponse Empty(string message)
        {
            return new SoftDeleteUserResponse(false, message);
        }
    }
}
