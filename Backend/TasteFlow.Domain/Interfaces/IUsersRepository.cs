using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IUsersRepository : IRepository<Users>
    {
        Task<Users> GetAuthenticatedAccountAsync(string email, string password);
        Task<Users> GetUserByEmailAsync(string email);
        Task<bool> RecoverPasswordAsync(UserPasswordManagement userPasswordManagement, string newPassword);
        Task<bool> UpdateUserPasswordAsync(UserPasswordManagement userPasswordManagement, string newPassword);
        Task<IEnumerable<Guid>> CreateUsersRangeAsync(IEnumerable<Users> users);
        IQueryable<Users> GetUsersPaged();
        Task<(List<Users> users, int totalCount)> GetUsersPagedWithCountDirectAsync(int page, int pageSize, object filter = null);
        Task<List<Users>> GetUsersPagedDirectAsync(int page, int pageSize, object filter = null); // Mantido para compatibilidade
        Task<bool> SoftDeleteUserAsync(Guid userId, Guid DeletedById);
        Task<Users> GetUserForUpdateByIdAsync(Guid id);
        Task<Users> GetUserByIdAsync(Guid id);
        Task<bool> UpdateUserAsync(Users user);
    }
}
