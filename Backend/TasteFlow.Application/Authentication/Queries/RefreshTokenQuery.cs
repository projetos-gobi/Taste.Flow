using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Responses;

namespace TasteFlow.Application.Authentication.Queries
{
    public record RefreshTokenQuery : IRequest<RefreshTokenResponse>
    {
        public Guid UserId { get; set; }
        public string RefreshToken { get; set; }
    }
}
