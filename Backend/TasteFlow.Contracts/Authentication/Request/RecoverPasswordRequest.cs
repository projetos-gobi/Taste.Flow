using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Authentication.Request
{
    public record RecoverPasswordRequest
    {
        public string Code { get; init; }
        public string OldPassword { get; init; }
        public string NewPassword { get; init; }
    }
}
