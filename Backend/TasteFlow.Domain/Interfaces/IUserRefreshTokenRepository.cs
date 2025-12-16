using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface IUserRefreshTokenRepository : IRepository<UserRefreshToken>
    {
        Task<UserRefreshToken> CreateUserRefreshTokenAsync(Guid userId);
        Task<UserRefreshToken> ForgotPasswordAsync(Users user);
        Task<UserRefreshToken> GetUserRefreshTokenByRefreshTokenAsync(Guid userId, string refreshToken);
    }
}
