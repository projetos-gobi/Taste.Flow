using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Commands;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Application.Authentication.Responses;
using TasteFlow.Shared.Extensions;

namespace TasteFlow.Application.Authentication.Handlers
{
    public class RecoverPasswordHandler : IRequestHandler<RecoverPasswordCommand, RecoverPasswordResponse>
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IUserPasswordManagementRepository _userPasswordManagementRepository;
        private readonly IEventLogger _eventLogger;

        public RecoverPasswordHandler(IUsersRepository usersRepository, IUserPasswordManagementRepository userPasswordManagementRepository, IEventLogger eventLogger)
        {
            _usersRepository = usersRepository;
            _userPasswordManagementRepository = userPasswordManagementRepository;
            _eventLogger = eventLogger;
        }

        public async Task<RecoverPasswordResponse> Handle(RecoverPasswordCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var token = await _userPasswordManagementRepository.GetUserPasswordManagementByCodeAsync(request.Code);

                if (token != null) 
                {
                    var user = await _usersRepository.GetUserByIdAsync(token.UserId);

                    if (user == null)
                    {
                        return RecoverPasswordResponse.Empty("Token de redefinição de senha inválido ou não encontrado.");
                    }

                    string passwordHash = request.OldPassword.ToSha256Hash(user.PasswordSalt);

                    if (passwordHash != user.PasswordHash)
                    {
                        return RecoverPasswordResponse.Empty("Credenciais inválidas do usuário.");
                    }

                    var result = await _usersRepository.UpdateUserPasswordAsync(token, request.NewPassword);

                    if (result)
                    {
                        await _userPasswordManagementRepository.UpdateUserPasswordManagementStatusAsync(token);
                    }

                    return new RecoverPasswordResponse(result, ((result)? "Senha alterada com sucesso." : "Ocorreu um erro na alteração de senha"));
                }

                return RecoverPasswordResponse.Empty("Token de redefinição de senha inválido ou não encontrado.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de redefinir a senha do usuário, token: {request.Code}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return RecoverPasswordResponse.Empty("Ocorreu um erro ao redefinir a senha do usuário.");
            }
        }
    }
}
