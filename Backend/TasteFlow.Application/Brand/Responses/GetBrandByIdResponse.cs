using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Brand.Responses
{
    public record GetBrandByIdResponse
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
        public string Name { get; set; }
    }
}
