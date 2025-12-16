using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Settings;

namespace TasteFlow.Infrastructure.Services
{
    public class MailSendService : IMailSendService
    {
        private readonly MailSendSettings _mailSendSettings;
        private readonly IEventLogger _eventLogger;

        public MailSendService(IOptions<MailSendSettings> options, IEventLogger eventLogger)
        {
            _mailSendSettings = options.Value;
            _eventLogger = eventLogger;
        }

        public async Task<bool> SendMultipleEmailsAsync(IEnumerable<Domain.Entities.Email> emails)
        {
            try
            {
                using var client = new SmtpClient();
                await client.ConnectAsync(_mailSendSettings.Server, _mailSendSettings.Port, _mailSendSettings.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);

                await client.AuthenticateAsync(_mailSendSettings.Username, _mailSendSettings.Password);

                foreach (var email in emails)
                {
                    var message = BuildMessage(email);
                    await client.SendAsync(message);
                }

                await client.DisconnectAsync(true);
                return true;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao enviar um lote de e-mails no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> SendSingleEmailAsync(Domain.Entities.Email email)
        {
            try
            {
                var message = BuildMessage(email);

                using var client = new SmtpClient();
                await client.ConnectAsync(_mailSendSettings.Server, _mailSendSettings.Port, SecureSocketOptions.SslOnConnect);

                await client.AuthenticateAsync(_mailSendSettings.Username, _mailSendSettings.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return true;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao enviar um lote de e-mails no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        private MimeMessage BuildMessage(Domain.Entities.Email email)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_mailSendSettings.FromName, _mailSendSettings.FromEmail));
            message.To.Add(new MailboxAddress("", "jajawa8286@baxidy.com"));
            message.Subject = email.Subject;
            message.Body = new TextPart("html") { Text = email.Body };

            return message;
        }
    }
}
