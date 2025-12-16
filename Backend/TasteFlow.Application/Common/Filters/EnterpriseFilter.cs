using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Common.Filters
{
    public class EnterpriseFilter
    {
        public Guid? LicenseId { get; set; }
        public string? FantasyName { get; set; }
        public string? Cnpj { get; set; }
        public string? City { get; set; }
        public bool? IsActive { get; set; }
    }
}
