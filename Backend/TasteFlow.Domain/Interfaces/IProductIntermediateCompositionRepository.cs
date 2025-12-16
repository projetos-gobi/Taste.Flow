using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IProductIntermediateCompositionRepository : IRepository<ProductIntermediateComposition>
    {
        Task<bool> ExistsByAsync<T>(Expression<Func<ProductIntermediateComposition, T>> selector, Guid id, Guid enterpriseId);
    }
}
