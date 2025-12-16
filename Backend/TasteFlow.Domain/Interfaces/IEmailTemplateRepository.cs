using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IEmailTemplateRepository : IRepository<EmailTemplate>
    {
        Task<Email> CreateTemplateEmailForgotPassword(Users user, string passwordResetToken, string password);
    }
}
