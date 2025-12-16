using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Users.Request
{
    public record CreateUsersRangeRequest
    {
        public IEnumerable<UserRequest> Users { get; set; }
        public Guid? EnterpriseId { get; set; }
    }
}
