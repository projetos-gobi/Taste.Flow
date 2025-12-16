using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Responses;

namespace TasteFlow.Application.Authentication.Queries
{
    public record ValidatePasswordResetTokenQuery : IRequest<ValidatePasswordResetTokenResponse>
    {
        public string PasswordResetToken { get; init; }
    }
}
