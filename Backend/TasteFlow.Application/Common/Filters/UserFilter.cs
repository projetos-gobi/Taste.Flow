using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Common.Filters
{
    public class UserFilter
    {
        public Guid? AccessProfileId { get; set; }
        public string? Name { get; set; }
        public string? FantasyName { get; set; }
        public string? EmailAddress { get; set; }
        public bool? IsActive { get; set; }
    }
}
