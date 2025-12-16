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
    public class GetUnitByIdHandler : IRequestHandler<GetUnitByIdQuery, GetUnitByIdResponse>
    {
        private readonly IUnitRepository _unitRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetUnitByIdHandler(IUnitRepository unitRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _unitRepository = unitRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetUnitByIdResponse> Handle(GetUnitByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _unitRepository.GetUnitByIdAsync(request.Id, request.EnterpriseId);

                var response = _mapper.Map<GetUnitByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um unidade pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
