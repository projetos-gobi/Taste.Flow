using AutoMapper;
using MediatR;
using TasteFlow.Application.Unit.Queries;
using TasteFlow.Application.Unit.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Unit.Handlers
{
    public class CheckUnitsExistHandler : IRequestHandler<CheckUnitsExistQuery, IEnumerable<CheckUnitsExistResponse>>
    {
        private readonly IUnitRepository _unitRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CheckUnitsExistHandler(IUnitRepository unitRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _unitRepository = unitRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CheckUnitsExistResponse>> Handle(CheckUnitsExistQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _unitRepository.GetExistingUnitsAsync(request.Units, request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<CheckUnitsExistResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a verificação de unidades existentes para a empresa {request.EnterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<CheckUnitsExistResponse>();
            }
        }
    }
}
