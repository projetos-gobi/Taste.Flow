using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Supplier.Responses
{
    public record GetAllSuppliersByEnterpriseIdResponse
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
        public string FantasyName { get; set; }
        public string SocialReason { get; set; }
    }
}
