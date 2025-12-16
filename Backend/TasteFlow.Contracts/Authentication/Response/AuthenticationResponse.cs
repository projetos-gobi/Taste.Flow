using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Authentication.Response
{
    public record AuthenticationResponse
    {
        public Guid UserId { get; init; }
        public string Email { get; init; }
        public string Role { get; init; }
        public string Token { get; init; }
        public string Message { get; init; }
        public string RefreshToken { get; init; }
        public string AuthenticationStatus { get; init; }
    }
}
