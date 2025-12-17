using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Queries;
using TasteFlow.Application.Authentication.Responses;
using TasteFlow.Domain.Enums;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Shared.Extensions;

namespace TasteFlow.Application.Authentication.Handlers
{
    public class AuthenticationHandler : IRequestHandler<AuthenticationQuery, AuthenticationResult>
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IUserRefreshTokenRepository _userRefreshTokenRepository;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly IEventLogger _eventLogger;

        public AuthenticationHandler(IUsersRepository usersRepository, IUserRefreshTokenRepository userRefreshTokenRepository, ITokenGenerator tokenGenerator, IEventLogger eventLogger)
        {
            _usersRepository = usersRepository;
            _userRefreshTokenRepository = userRefreshTokenRepository;
            _tokenGenerator = tokenGenerator;
            _eventLogger = eventLogger;
        }

        public async Task<AuthenticationResult> Handle(AuthenticationQuery request, CancellationToken cancellationToken)
        {
			try
			{
                Console.WriteLine($"[DEBUG HANDLER] Looking for user with email: {request.Email.Value}");
                var result = await _usersRepository.GetAuthenticatedAccountAsync(request.Email.Value, request.Password.Value);

                if (result == null)
                {
                    Console.WriteLine("[DEBUG HANDLER] User NOT FOUND in database!");
                    return AuthenticationResult.Empty(AuthenticationStatusEnum.UserNotFound, "Usuário não encontrado.");
                }
                
                Console.WriteLine($"[DEBUG HANDLER] User FOUND! ID: {result.Id}, Email: {result.EmailAddress}");
                Console.WriteLine($"[DEBUG HANDLER] Salt from DB: {result.PasswordSalt}");
                Console.WriteLine($"[DEBUG HANDLER] Hash from DB: {result.PasswordHash}");
                 
                if (result.AccessProfileId == AccessProfileEnum.User.Id && !result.UserEnterprises.Any(ue => ue.LicenseManagement != null 
                && ue.LicenseManagement.IsActive && (ue.LicenseManagement.IsIndefinite || ue.LicenseManagement.ExpirationDate >= DateTime.UtcNow)))
                {
                    Console.WriteLine("[DEBUG HANDLER] License check failed!");
                    return AuthenticationResult.Empty(AuthenticationStatusEnum.InvalidCredentials, "Credenciais inválidas.");
                }

                string passwordHash = request.Password.Value.ToSha256Hash(result.PasswordSalt);
                Console.WriteLine($"[DEBUG HANDLER] Generated hash: {passwordHash}");
                Console.WriteLine($"[DEBUG HANDLER] Hash match: {passwordHash == result.PasswordHash}");

                if (passwordHash != result.PasswordHash)
                {
                    Console.WriteLine("[DEBUG HANDLER] PASSWORD MISMATCH!");
                    return AuthenticationResult.Empty(AuthenticationStatusEnum.InvalidCredentials, "Credenciais inválidas.");
                }

                Console.WriteLine("[DEBUG HANDLER] Creating refresh token...");
                var refreshToken = await _userRefreshTokenRepository.CreateUserRefreshTokenAsync(result.Id);
                Console.WriteLine($"[DEBUG HANDLER] Refresh token created: {refreshToken?.RefreshToken?.Substring(0, 10)}...");

                Console.WriteLine("[DEBUG HANDLER] Generating JWT token...");
                var token = _tokenGenerator.GenerateToken(result);
                Console.WriteLine($"[DEBUG HANDLER] JWT token generated: {(!string.IsNullOrEmpty(token) ? token.Substring(0, 20) + "..." : "EMPTY!")}");

                Console.WriteLine($"[DEBUG HANDLER] Returning success with token length: {token?.Length ?? 0}");
                return new AuthenticationResult(result.Id, result.EmailAddress, result.AccessProfileId.ToString(), token, "Autenticação realizada com sucesso.", refreshToken.RefreshToken, AuthenticationStatusEnum.Success);
            }
			catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o login de um usuário: E-mail: {request.Email}";
                Console.WriteLine($"[DEBUG HANDLER] EXCEPTION! {ex.Message}");
                Console.WriteLine($"[DEBUG HANDLER] Stack: {ex.StackTrace}");

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return AuthenticationResult.Empty(AuthenticationStatusEnum.Error, "Ocorreu um erro ao processar a autenticação.");
            }
        }
    }
}
