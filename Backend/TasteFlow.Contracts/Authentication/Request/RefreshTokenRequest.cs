using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Authentication.Request
{
    public record RefreshTokenRequest
    {
        public Guid UserId { get; init; }
        public string RefreshToken { get; init; }
    }
}
