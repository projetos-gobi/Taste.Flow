using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Commands;
using TasteFlow.Application.Authentication.Responses;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Shared.Extensions;

namespace TasteFlow.Application.Authentication.Handlers
{
    public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResponse>
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IUserPasswordManagementRepository _userPasswordManagementRepository;
        private readonly IEmailTemplateRepository _emailTemplateRepository;
        private readonly IMailSendService _mailSendService;
        private readonly IEventLogger _eventLogger;

        public ForgotPasswordHandler(IUsersRepository usersRepository, IUserPasswordManagementRepository userPasswordManagementRepository, IEmailTemplateRepository emailTemplateRepository, IMailSendService mailSendService, IEventLogger eventLogger)
        {
            _usersRepository = usersRepository;
            _userPasswordManagementRepository = userPasswordManagementRepository;
            _emailTemplateRepository = emailTemplateRepository;
            _mailSendService = mailSendService;
            _eventLogger = eventLogger;
        }

        public async Task<ForgotPasswordResponse> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _usersRepository.GetUserByEmailAsync(request.Email.Value);

                if (user != null) 
                {
                    var result = await _userPasswordManagementRepository.ForgotPasswordAsync(user);

                    if (result == null)
                    {
                        return new ForgotPasswordResponse(false, "Não foi possível redefinir a senha.");
                    }

                    string newPassword = StringExtension.GenerateRandomPassword(12);

                    var emailTemplate = await _emailTemplateRepository.CreateTemplateEmailForgotPassword(user, result.Code, newPassword);

                    var passwordRecoved = await _usersRepository.RecoverPasswordAsync(result, newPassword);

                    if (passwordRecoved)
                    {
                        var emailSend = await _mailSendService.SendSingleEmailAsync(emailTemplate);
                    }

                    return new ForgotPasswordResponse(true, "Instruções para redefinição de senha foram enviadas com sucesso.");
                }

                return new ForgotPasswordResponse(false, "Usuário não encontrado.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de redefinir a senha do usuário e-mail: {request.Email}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return ForgotPasswordResponse.Empty("Ocorreu um erro ao processar redefinição de senha.");
            }
        }
    }
}
