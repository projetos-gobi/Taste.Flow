using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;

namespace TasteFlow.Application.Enterprise.Responses
{
    public record GetEnterpriseByIdResponse
    {
        public Guid Id { get; init; }
        public Guid? LicenseId { get; init; }
        public string? FantasyName { get; init; }
        public string? SocialReason { get; init; }
        public string? Cnpj { get; init; }
        public int? LicenseQuantity { get; init; }
        public string? MunicipalRegistration { get; init; }
        public string? StateRegistration { get; init; }
        public string? Observation { get; init; }
        public bool IsActive { get; init; }

        public LicenseDTO? License { get; init; }
        public List<EnterpriseAddressDTO> EnterpriseAddresses { get; init; } = new();
        public List<EnterpriseContactDTO> EnterpriseContacts { get; init; } = new();
    }
}
