using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Responses;

namespace TasteFlow.Application.Authentication.Commands
{
    public record RecoverPasswordCommand : IRequest<RecoverPasswordResponse>
    {
        public string Code { get; init; }
        public string OldPassword { get; init; }
        public string NewPassword { get; init; }
    }
}
