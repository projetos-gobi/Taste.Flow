using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Brand.Request
{
    public record GetBrandByIdRequest
    {
        public Guid Id { get; set; }
    }
}
