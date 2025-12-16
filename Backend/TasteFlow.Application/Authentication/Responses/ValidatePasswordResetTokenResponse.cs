using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Authentication.Responses
{
    public record ValidatePasswordResetTokenResponse
    {
        public bool Allowed { get; set; }
        public string Message { get; set; }
        public DateTime Expiry { get; set; }

        public ValidatePasswordResetTokenResponse(bool allowed, string message, DateTime expiry)
        {
            Allowed = allowed;
            Message = message;
            Expiry = expiry;
        }

        public static ValidatePasswordResetTokenResponse Empty(string message)
        {
            return new ValidatePasswordResetTokenResponse(false, message, DateTime.UtcNow);
        }
    }
}
