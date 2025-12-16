using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Enums.Base;

namespace TasteFlow.Domain.Enums
{
    public sealed class EmailTemplateEnum : SmartEnum<EmailTemplateEnum>
    {
        public static readonly EmailTemplateEnum TemplateForgotPassword = new EmailTemplateEnum(new Guid("AC8216BF-BEEA-44C9-B4C5-D15DF6E145F5"), nameof(TemplateForgotPassword));
        public static readonly EmailTemplateEnum TemplateNewUser = new EmailTemplateEnum(new Guid("5042089B-A9BA-4FB9-B5B2-AFEEEB4B4F4D"), nameof(TemplateNewUser));

        public EmailTemplateEnum(Guid id, string name) : base(id, name)
        {
        }
    }
}
