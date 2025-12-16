using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.Merchandise.Responses;

namespace TasteFlow.Application.Merchandise.Commands
{
    public record UpdateMerchandiseCommand : IRequest<UpdateMerchandiseResponse>
    {
        public MerchandiseDTO Merchandise { get; set; }
        public Guid EnterpriseId { get; set; }
    }
}
