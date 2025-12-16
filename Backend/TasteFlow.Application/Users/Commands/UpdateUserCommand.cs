using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.Users.Responses;

namespace TasteFlow.Application.Users.Commands
{
    public record UpdateUserCommand : IRequest<UpdateUserResponse>
    {
        public UsersDTO User { get; set; }

    }
}
