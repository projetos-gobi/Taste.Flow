using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.Enterprise.Responses;

namespace TasteFlow.Application.Enterprise.Commands
{
    public class CreateEnterpriseCommand : IRequest<CreateEnterpriseResponse>
    {
        public EnterpriseDTO Enterprise { get; set; }
    }
}
