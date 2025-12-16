using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.EnterpriseAddress.Request
{
    public record EnterpriseAddressRequest
    {
        public string PostalCode { get; init; }
        public string Street { get; init; }
        public string Number { get; init; }
        public string Complement { get; init; }
        public string District { get; init; }
        public string City { get; init; }
        public string State { get; init; }
    }
}
