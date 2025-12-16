using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Users.Request
{
    public record GetUserByIdRequest
    {
        public Guid Id { get; set; }
    }
}
