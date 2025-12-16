using AutoMapper;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Unit.Commands;
using TasteFlow.Application.Unit.Responses;

namespace TasteFlow.Application.Unit.Handlers
{
    public class SoftDeleteUnitHandler : IRequestHandler<SoftDeleteUnitCommand, SoftDeleteUnitResponse>
    {
        private readonly IUnitRepository _unitRepository;
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteUnitHandler(IUnitRepository unitRepository, IMerchandiseRepository merchandiseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _unitRepository = unitRepository;
            _merchandiseRepository = merchandiseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteUnitResponse> Handle(SoftDeleteUnitCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var inUse = await _merchandiseRepository.ExistsByAsync(m => m.UnitId, request.Id, request.EnterpriseId);

                if (inUse)
                {
                    return new SoftDeleteUnitResponse(false, "Não é possível deletar a unidade, pois ela está sendo utilizada em Mercadorias.");
                }

                var result = await _unitRepository.SoftDeleteUnitAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteUnitResponse(result, (result) ? "Unidade foi deletada com sucesso." : "Não foi possível deletar a unidade.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de uma unidade pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteUnitResponse.Empty("Ocorreu um erro durante o processo soft delete de uma unidade.");
            }
        }
    }
}
