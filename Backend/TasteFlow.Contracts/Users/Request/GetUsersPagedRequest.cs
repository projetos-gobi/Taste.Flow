using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common.Filters;
using TasteFlow.Application.Common;

namespace TasteFlow.Contracts.Users.Request
{
    public record GetUsersPagedRequest
    {
        public PageQuery Query { get; set; }
        public UserFilter Filter { get; set; }
    }
}
