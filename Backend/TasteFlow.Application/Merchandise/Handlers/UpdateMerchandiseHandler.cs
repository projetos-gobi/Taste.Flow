using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Merchandise.Commands;
using TasteFlow.Application.Merchandise.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Merchandise.Handlers
{
    public class UpdateMerchandiseHandler : IRequestHandler<UpdateMerchandiseCommand, UpdateMerchandiseResponse>
    {
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateMerchandiseHandler(IMerchandiseRepository merchandiseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _merchandiseRepository = merchandiseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateMerchandiseResponse> Handle(UpdateMerchandiseCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var merchandise = _mapper.Map<Domain.Entities.Merchandise>(request.Merchandise);

                var result = await _merchandiseRepository.UpdateMerchandiseAsync(merchandise, request.EnterpriseId);

                return new UpdateMerchandiseResponse(result, (result) ? "Mercadoria atualizada com sucesso." : "Não foi possível atualizar a mercadoria.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de uma mercadoria ID: {request.Merchandise.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateMerchandiseResponse.Empty("Ocorreu um erro durante o processo atualização de uma mercadoria.");
            }
        }
    }
}
