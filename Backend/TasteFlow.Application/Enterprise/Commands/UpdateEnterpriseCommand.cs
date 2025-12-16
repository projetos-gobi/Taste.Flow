using MediatR;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.Enterprise.Responses;

namespace TasteFlow.Application.Enterprise.Commands
{
    public class UpdateEnterpriseCommand : IRequest<UpdateEnterpriseResponse>
    {
        public EnterpriseDTO Enterprise { get; set; }
    }
}
