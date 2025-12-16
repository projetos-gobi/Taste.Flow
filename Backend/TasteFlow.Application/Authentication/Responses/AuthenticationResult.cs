using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Enums;

namespace TasteFlow.Application.Authentication.Responses
{
    public record AuthenticationResult
    {
        public Guid UserId { get; init; }
        public string Email { get; init; }
        public string Role { get; init; }
        public string Token { get; init; }
        public string Message { get; init; }
        public string RefreshToken { get; init; }
        public string AuthenticationStatus { get; init; }

        public AuthenticationResult(Guid userId, string email, string role, string token, string message, string refreshToken, AuthenticationStatusEnum authenticationStatus)
        {
            UserId = userId;
            Email = email;
            Role = role;
            Token = token;
            Message = message;
            RefreshToken = refreshToken;
            AuthenticationStatus = authenticationStatus.Name;
        }

        public static AuthenticationResult Empty(AuthenticationStatusEnum authenticationStatus, string message)
        {
            return new AuthenticationResult(Guid.Empty, string.Empty, string.Empty, string.Empty, message, string.Empty, authenticationStatus);
        }
    }
}
