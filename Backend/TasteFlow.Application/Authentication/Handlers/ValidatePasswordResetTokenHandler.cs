using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Queries;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Application.Authentication.Responses;

namespace TasteFlow.Application.Authentication.Handlers
{
    public class ValidatePasswordResetTokenHandler : IRequestHandler<ValidatePasswordResetTokenQuery, ValidatePasswordResetTokenResponse>
    {
        private readonly IUserRefreshTokenRepository _userRefreshTokenRepository;
        private readonly IEventLogger _eventLogger;

        public ValidatePasswordResetTokenHandler(IUserRefreshTokenRepository userRefreshTokenRepository, IEventLogger eventLogger)
        {
            _userRefreshTokenRepository = userRefreshTokenRepository;
            _eventLogger = eventLogger;
        }

        public async Task<ValidatePasswordResetTokenResponse> Handle(ValidatePasswordResetTokenQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _userRefreshTokenRepository.GetUserRefreshTokenByRefreshTokenAsync(Guid.Empty, request.PasswordResetToken);

                if (result != null)
                {
                    if (result.ExpirationDate < DateTime.Now)
                    {
                        return ValidatePasswordResetTokenResponse.Empty("O token de redefinição de senha expirou. Solicite um novo.");
                    }

                    return new ValidatePasswordResetTokenResponse(true, "Token válido.", result.ExpirationDate);
                }

                return ValidatePasswordResetTokenResponse.Empty("Token de redefinição de senha inválido ou não encontrado.");
            }
            catch (Exception ex)
            {
                var message = $"Erro ao validar token de redefinição de senha. Token: {request.PasswordResetToken}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return ValidatePasswordResetTokenResponse.Empty("Não foi possível validar o token de redefinição de senha no momento. Tente novamente mais tarde.");
            }
        }
    }
}
