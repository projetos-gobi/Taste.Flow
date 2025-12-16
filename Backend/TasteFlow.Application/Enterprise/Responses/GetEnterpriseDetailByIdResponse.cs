using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Enterprise.Responses
{
    public record GetEnterpriseDetailByIdResponse
    {
        public Guid Id { get; set; }
        public string FantasyName { get; set; }
        public string SocialReason { get; set; }
        public string Cnpj { get; set; }
        public string StateRegistration { get; set; }
        public string MunicipalRegistration { get; set; }
    }
}
