using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Enterprise.Request
{
    public record GetEnterpriseByIdRequest
    {
        public Guid Id { get; set; }
    }
}
