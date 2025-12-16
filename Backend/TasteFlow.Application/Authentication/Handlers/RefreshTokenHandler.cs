using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Queries;
using TasteFlow.Application.Authentication.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Enums;
using TasteFlow.Application.Common;

namespace TasteFlow.Application.Authentication.Handlers
{
    public class RefreshTokenHandler : IRequestHandler<RefreshTokenQuery, RefreshTokenResponse>
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IUserRefreshTokenRepository _userRefreshTokenRepository;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly IEventLogger _eventLogger;

        public RefreshTokenHandler(IUsersRepository usersRepository, IUserRefreshTokenRepository userRefreshTokenRepository, ITokenGenerator tokenGenerator, IEventLogger eventLogger)
        {
            _usersRepository = usersRepository;
            _userRefreshTokenRepository = userRefreshTokenRepository;
            _tokenGenerator = tokenGenerator;
            _eventLogger = eventLogger;
        }

        public async Task<RefreshTokenResponse> Handle(RefreshTokenQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var userRefreshToken = await _userRefreshTokenRepository.GetUserRefreshTokenByRefreshTokenAsync(request.UserId, request.RefreshToken);

                if (userRefreshToken == null)
                {
                    return RefreshTokenResponse.Empty(AuthenticationStatusEnum.UserNotFound, "Usuário não encontrado ou token inválido.");
                }

                if (DateTime.Now > userRefreshToken.ExpirationDate)
                {
                    return RefreshTokenResponse.Empty(AuthenticationStatusEnum.InvalidCredentials, "Token de acesso expirou.");
                }

                var user = userRefreshToken.User;

                var token = _tokenGenerator.GenerateToken(user);

                return new RefreshTokenResponse(user.Id, user.EmailAddress, user.AccessProfileId.ToString(), token, "Autenticação realizada com sucesso.", userRefreshToken.RefreshToken, AuthenticationStatusEnum.Success);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o refresh do token de um usuário, UserId: {request.UserId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return RefreshTokenResponse.Empty(AuthenticationStatusEnum.Error, "Ocorreu um erro ao processar a autenticação.");
            }
        }
    }
}
