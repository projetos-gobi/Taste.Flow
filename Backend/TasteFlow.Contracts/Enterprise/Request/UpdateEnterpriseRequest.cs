using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Contracts.EnterpriseAddress.Request;
using TasteFlow.Contracts.EnterpriseContact.Request;

namespace TasteFlow.Contracts.Enterprise.Request
{
    public record UpdateEnterpriseRequest
    {
        public Guid Id { get; init; }
        public Guid? LicenseId { get; init; }
        public string FantasyName { get; init; }
        public string SocialReason { get; init; }
        public string Cnpj { get; init; }
        public string StateRegistration { get; init; }
        public string MunicipalRegistration { get; init; }
        public string Observation { get; init; }
        public int LicenseQuantity { get; init; }
        public bool IsActive { get; init; }

        public IEnumerable<EnterpriseAddressRequest> EnterpriseAddresses { get; init; } = new List<EnterpriseAddressRequest>();
        public IEnumerable<EnterpriseContactRequest> EnterpriseContacts { get; init; } = new List<EnterpriseContactRequest>();
    }
}
