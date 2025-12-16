using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Responses;
using TasteFlow.Domain.ValueObjects;

namespace TasteFlow.Application.Authentication.Queries
{
    public record AuthenticationQuery : IRequest<AuthenticationResult>
    {
        public Domain.ValueObjects.Email Email { get; set; }
        public Password Password { get; set; }
    }
}
