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

namespace TasteFlow.Application.Unit.Handlers
{
    public class CreateUnitsRangeHandler : IRequestHandler<CreateUnitsRangeCommand, CreateUnitsRangeResponse>
    {
        private readonly IUnitRepository _unitRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateUnitsRangeHandler(IUnitRepository unitRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _unitRepository = unitRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateUnitsRangeResponse> Handle(CreateUnitsRangeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var units = _mapper.Map<IEnumerable<Domain.Entities.Unit>>(request.Units);

                units.ToList().ForEach(x => x.EnterpriseId = request.EnterpriseId);

                var result = await _unitRepository.CreateUnitsRangeAsync(units);

                return new CreateUnitsRangeResponse(result, ((result) ? "Unidades criadas com sucesso." : "Não foi possível criar as unidades no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de unidades para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateUnitsRangeResponse.Empty("Ocorreu um erro durante o processo de criação de unidades para empresa.");
            }
        }
    }
}
