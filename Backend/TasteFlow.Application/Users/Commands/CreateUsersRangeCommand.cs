using MediatR;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.Users.Responses;

namespace TasteFlow.Application.Users.Commands
{
    public record CreateUsersRangeCommand : IRequest<CreateUsersRangeResponse>
    {
        public IEnumerable<UsersDTO> Users { get; set; }
        public Guid? EnterpriseId { get; set; }
    }
}
