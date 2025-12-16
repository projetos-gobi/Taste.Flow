using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Enterprise.Responses
{
    public record GetAllEnterprisesForUserRegistrationResponse
    {
        public Guid Id { get; set; }
        public Guid? LicenseId { get; set; }
        public string? FantasyName { get; set; }
        public string? SocialReason { get; set; }
        public string? Cnpj { get; set; }
        public int? LicenseQuantity { get; set; }
        public bool HasUnlimitedLicenses { get; set; }
    }
}
