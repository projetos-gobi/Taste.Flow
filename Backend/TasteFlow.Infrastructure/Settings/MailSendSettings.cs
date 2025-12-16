using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Infrastructure.Settings
{
    public class MailSendSettings
    {
        public const string SectionName = "SmtpSettings";
        public string Server { get; set; }
        public int Port { get; init; }
        public string Username { get; init; } = null!;
        public string Password { get; init; } = null!;
        public bool UseSsl { get; init; }
        public string FromName { get; init; } = null!;
        public string FromEmail { get; init; } = null!;
    }
}
