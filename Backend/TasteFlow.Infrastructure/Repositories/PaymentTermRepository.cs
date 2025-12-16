using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class PaymentTermRepository : BaseRepository<PaymentTerm>, IPaymentTermRepository
    {
        private readonly IEventLogger _eventLogger;

        public PaymentTermRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
        }

        public async Task<IEnumerable<PaymentTerm>> GetAllPaymentTermsAsync()
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.IsActive && !x.IsDeleted)
                    .Select(x => new PaymentTerm()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Order = x.Order,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedOn = x.CreatedOn
                    }).OrderBy(x => x.Order).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de buscar todos prazos de pagamento";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<PaymentTerm>();
            }
        }
    }
}
