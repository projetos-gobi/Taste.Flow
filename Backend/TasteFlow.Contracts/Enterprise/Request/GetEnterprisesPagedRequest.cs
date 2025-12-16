using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Common.Filters;

namespace TasteFlow.Contracts.Enterprise.Request
{
    public record GetEnterprisesPagedRequest
    {
        public PageQuery Query { get; set; }
        public EnterpriseFilter Filter { get; set; }
    }
}
