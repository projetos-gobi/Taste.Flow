using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IProductCompositionRepository : IRepository<ProductComposition>
    {
        Task<bool> ExistsByAsync<T>(Expression<Func<ProductComposition, T>> selector, Guid id, Guid enterpriseId);
    }
}
