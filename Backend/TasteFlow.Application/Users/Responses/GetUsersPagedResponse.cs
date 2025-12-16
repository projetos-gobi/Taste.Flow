using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Users.Responses
{
    public record GetUsersPagedResponse
    {
        public Guid Id { get; init; }
        public Guid AccessProfileId { get; init; }
        public string Name { get; init; }
        public string EnterpriseName { get; init; }
        public string EmailAddress { get; init; }
        public string LicenseName { get; init; }
        public string Contact { get; init; }
        public string AccessProfileName { get; init; }
        public bool IsActive { get; init; }
    }
}
