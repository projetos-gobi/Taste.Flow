using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class ProductIntermediateCompositionRepository : BaseRepository<ProductIntermediateComposition>, IProductIntermediateCompositionRepository
    {
        public ProductIntermediateCompositionRepository(TasteFlowContext context) : base(context)
        {
        }

        public async Task<bool> ExistsByAsync<T>(Expression<Func<ProductIntermediateComposition, T>> selector, Guid id, Guid enterpriseId)
        {
            try
            {
                var parameter = selector.Parameters[0];

                var constantType = typeof(T) == typeof(Guid?) ? typeof(Guid?) : typeof(Guid);

                var constant = Expression.Constant(id, constantType);

                var body = Expression.Equal(selector.Body, constant);

                var predicate = Expression.Lambda<Func<ProductIntermediateComposition, bool>>(body, parameter);

                return await DbSet.Where(m => m.EnterpriseId == enterpriseId && m.IsActive && !m.IsDeleted).AnyAsync(predicate);
            }
            catch (Exception ex)
            {
                var message = $"Erro ao verificar existência em produto intermediário.";
                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false; // fallback seguro
            }
        }
    }
}
