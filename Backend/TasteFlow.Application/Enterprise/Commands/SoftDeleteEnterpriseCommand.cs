using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Enterprise.Responses;

namespace TasteFlow.Application.Enterprise.Commands
{
    public record SoftDeleteEnterpriseCommand : IRequest<SoftDeleteEnterpriseResponse>
    {
        public Guid Id { get; set; }
    }
}
