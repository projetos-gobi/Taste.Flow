using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.EnterpriseContact.Request
{
    public record EnterpriseContactRequest
    {
        public string Telephone { get; init; }
        public string EmailAddress { get; init; }
        public string Responsible { get; init; }
    }
}
