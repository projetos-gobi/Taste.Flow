using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Authentication.Responses
{
    public record GetEnterprisesPagedResponse
    {
        public Guid Id { get; set; }
        public Guid? LicenseId { get; set; }
        public string? FantasyName { get; set; }
        public string? LicenseName { get; set; }
        public string? Cnpj { get; set; }
        public string? EmailAddress { get; set; }
        public string? Contact { get; set; }
        public string? Address { get; set; }
        public int? LicenseQuantity { get; set; }
        public bool IsActive { get; set; }
    }
}
