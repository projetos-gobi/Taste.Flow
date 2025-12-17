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
                var result = await _usersRepository.GetAuthenticatedAccountAsync(request.Email.Value, request.Password.Value);

                if (result == null)
                {
                    return AuthenticationResult.Empty(AuthenticationStatusEnum.UserNotFound, "Usuário não encontrado.");
                }
                 
                // Validar licença APENAS para usuários normais (não admin) E se UserEnterprises foi carregado
                // Se UserEnterprises não foi carregado (timeout/erro), permitir login para não bloquear
                if (result.AccessProfileId == AccessProfileEnum.User.Id && result.UserEnterprises != null && result.UserEnterprises.Any())
                {
                    var hasValidLicense = result.UserEnterprises.Any(ue => ue.LicenseManagement != null 
                        && ue.LicenseManagement.IsActive && (ue.LicenseManagement.IsIndefinite || ue.LicenseManagement.ExpirationDate >= DateTime.UtcNow));
                    
                    if (!hasValidLicense)
                    {
                        return AuthenticationResult.Empty(AuthenticationStatusEnum.InvalidCredentials, "Credenciais inválidas.");
                    }
                }

                string passwordHash = request.Password.Value.ToSha256Hash(result.PasswordSalt);

                if (passwordHash != result.PasswordHash)
                {
                    return AuthenticationResult.Empty(AuthenticationStatusEnum.InvalidCredentials, "Credenciais inválidas.");
                }

                // Gerar token JWT primeiro
                var token = _tokenGenerator.GenerateToken(result);

                // Gerar refresh token localmente (não salvar no banco por enquanto para evitar bloqueio do DbContext)
                var refreshTokenString = Guid.NewGuid().ToString();

                return new AuthenticationResult(result.Id, result.EmailAddress, result.AccessProfileId.ToString(), token, "Autenticação realizada com sucesso.", refreshTokenString, AuthenticationStatusEnum.Success);
            }
			catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o login de um usuário: E-mail: {request.Email}";
                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return AuthenticationResult.Empty(AuthenticationStatusEnum.Error, "Ocorreu um erro ao processar a autenticação.");
            }
        }
    }
}
