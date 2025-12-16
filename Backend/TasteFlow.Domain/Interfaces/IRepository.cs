using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Domain.Interfaces
{
    public interface IRepository<TEntity> : IDisposable
    {
        void Add(TEntity entity);
        void AddRange(IEnumerable<TEntity> entities);
        IQueryable<TEntity> GetAll();
        IQueryable<TEntity> GetAllNoTracking();
        Task<TEntity?> GetByIdAsync(Guid id);
        void Update(TEntity entity);
        void Remove(TEntity entity, bool hardDelete = false);
        void RemoveRange(IEnumerable<TEntity> entities, bool hardDelete = false);
        Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate);
        Task<int> SaveChangesAsync();
    }
}
