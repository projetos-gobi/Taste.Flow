using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Brand.Responses;

namespace TasteFlow.Application.Brand.Commands
{
    public record SoftDeleteBrandCommand : IRequest<SoftDeleteBrandResponse>
    {
        public Guid Id { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
