using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IUserPasswordManagementRepository : IRepository<UserPasswordManagement>
    {
        Task<UserPasswordManagement> ForgotPasswordAsync(Users user);
        Task<UserPasswordManagement> GetUserPasswordManagementByCodeAsync(string code);
        Task<bool> UpdateUserPasswordManagementStatusAsync(UserPasswordManagement userPasswordManagement);
    }
}
