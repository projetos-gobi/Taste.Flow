using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Users.Request
{
    public record SoftDeleteUserRequest
    {
        public Guid Id { get; init; }
    }
}
