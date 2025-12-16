using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Enterprise.Responses;

namespace TasteFlow.Application.Enterprise.Queries
{
    public record GetEnterpriseByIdQuery : IRequest<GetEnterpriseByIdResponse>
    {
        public Guid Id { get; init; }
    }
}
