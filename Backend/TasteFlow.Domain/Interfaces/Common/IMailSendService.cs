using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces.Common
{
    public interface IMailSendService
    {
        Task<bool> SendSingleEmailAsync(Email email);
        Task<bool> SendMultipleEmailsAsync(IEnumerable<Email> emails);
    }
}
