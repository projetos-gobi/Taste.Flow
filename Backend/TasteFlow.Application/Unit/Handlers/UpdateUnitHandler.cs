using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Unit.Commands;
using TasteFlow.Application.Unit.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Application.Users.Responses;

namespace TasteFlow.Application.Unit.Handlers
{
    public class UpdateUnitHandler : IRequestHandler<UpdateUnitCommand, UpdateUnitResponse>
    {
        private readonly IUnitRepository _unitRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateUnitHandler(IUnitRepository unitRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _unitRepository = unitRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateUnitResponse> Handle(UpdateUnitCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var unit = _mapper.Map<Domain.Entities.Unit>(request.Unit);

                var result = await _unitRepository.UpdateUnitAsync(unit, request.EnterpriseId);

                return new UpdateUnitResponse(result, (result) ? "Unidade atualizada com sucesso." : "Não foi possível atualizar a unidade.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de uma unidade pelo ID: {request.Unit.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateUnitResponse.Empty("Ocorreu um erro durante o processo atualização de uma unidade.");
            }
        }
    }
}
