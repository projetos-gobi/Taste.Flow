using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Unit.Queries;
using TasteFlow.Application.Unit.Responses;

namespace TasteFlow.Application.Unit.Handlers
{
    public class GetAllUnitsByEnterpriseIdHandler : IRequestHandler<GetAllUnitsByEnterpriseIdQuery, IEnumerable<GetAllUnitsByEnterpriseIdResponse>>
    {
        private readonly IUnitRepository _unitRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllUnitsByEnterpriseIdHandler(IUnitRepository unitRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _unitRepository = unitRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllUnitsByEnterpriseIdResponse>> Handle(GetAllUnitsByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _unitRepository.GetAllUnitsByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllUnitsByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todas as unidades pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllUnitsByEnterpriseIdResponse>();
            }
        }
    }
}
