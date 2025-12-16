using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IPaymentTypeRepository : IRepository<PaymentType>
    {
        Task<IEnumerable<PaymentType>> GetAllPaymentTypesByEnterpriseIdAsync(Guid enterpriseId);
    }
}
