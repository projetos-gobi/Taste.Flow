using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Users.Responses;

namespace TasteFlow.Application.Users.Commands
{
    public record SoftDeleteUserCommand : IRequest<SoftDeleteUserResponse>
    {
        public Guid Id { get; set; }
    }
}
