using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Users.Request
{
    public record UserRequest
    {
        public Guid AccessProfileId { get; set; }
        public Guid? EnterpriseId { get; set; }
        public string Name { get; init; }
        public string EmailAddress { get; init; }
        public string Contact { get; init; }
        public bool IsActive { get; init; }
    }
}
