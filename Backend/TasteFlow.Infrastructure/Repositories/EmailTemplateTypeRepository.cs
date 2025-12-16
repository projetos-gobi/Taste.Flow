using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class EmailTemplateTypeRepository : BaseRepository<EmailTemplateType>, IEmailTemplateTypeRepository
    {
        public EmailTemplateTypeRepository(TasteFlowContext context) : base(context)
        {
        }
    }
}
