using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Enums;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class EmailTemplateRepository : BaseRepository<EmailTemplate>, IEmailTemplateRepository
    {
        private readonly IEventLogger _eventLogger;
        private readonly IConfiguration _configuration;

        public EmailTemplateRepository(TasteFlowContext context, IEventLogger eventLogger, IConfiguration configuration) : base(context)
        {
            _eventLogger = eventLogger;
            _configuration = configuration;
        }

        public async Task<Email> CreateTemplateEmailForgotPassword(Users user, string passwordResetToken, string password)
        {
            try
            {
                var emailTemplate = await GetByIdAsync(EmailTemplateEnum.TemplateForgotPassword.Id);

                var email = new Email();

                if (emailTemplate != null)
                {
                    //var link = string.Format("{0}/Login?RecoverPassword={1}", _configuration["TasteFlow:Domain"], passwordResetToken);
                    var body = emailTemplate.Body.Replace("[Name]", user.Name).Replace("[Password]", password);
                    email.UserId = user.Id;
                    email.Subject = emailTemplate.Subject;
                    email.Body = body;
                    email.EmailTemplateId = EmailTemplateEnum.TemplateForgotPassword.Id;
                    email.Recipient = user.EmailAddress;
                }

                return email;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro criação do template de redefinir a senha do usuário e-mail: {user.EmailAddress}, PasswordResetToken: {passwordResetToken}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
