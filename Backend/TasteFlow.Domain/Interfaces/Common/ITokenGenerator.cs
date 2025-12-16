using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces.Common
{
    public interface ITokenGenerator
    {
        string GenerateToken(Users user);
    }
}
