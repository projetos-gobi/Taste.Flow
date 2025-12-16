using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Enums;

namespace TasteFlow.Application.Authentication.Responses
{
    public record ForgotPasswordResponse
    {
        public bool Allowed { get; set; }
        public string Message { get; set; }

        public ForgotPasswordResponse(bool allowed, string message)
        {
            Allowed = allowed;
            Message = message;
        }

        public static ForgotPasswordResponse Empty(string message)
        {
            return new ForgotPasswordResponse(false, message);
        }
    }
}
