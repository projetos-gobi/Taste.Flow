using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Authentication.Request
{
    public record ForgotPasswordRequest
    {
        public string Email { get; init; }
    }
}
