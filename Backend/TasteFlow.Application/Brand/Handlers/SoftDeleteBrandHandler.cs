using AutoMapper;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Brand.Commands;
using TasteFlow.Application.Brand.Responses;

namespace TasteFlow.Application.Brand.Handlers
{
    public class SoftDeleteBrandHandler : IRequestHandler<SoftDeleteBrandCommand, SoftDeleteBrandResponse>
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteBrandHandler(IBrandRepository brandRepository, IMerchandiseRepository merchandiseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _merchandiseRepository = merchandiseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteBrandResponse> Handle(SoftDeleteBrandCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var inUse = await _merchandiseRepository.ExistsByAsync(m => m.BrandId, request.Id, request.EnterpriseId);

                if (inUse)
                {
                    return new SoftDeleteBrandResponse(false, "Não é possível deletar a marca, pois ela está sendo utilizada em Mercadorias.");
                }

                var result = await _brandRepository.SoftDeleteBrandAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteBrandResponse(result, (result) ? "Marca foi deletada com sucesso." : "Não foi possível deletar a marca.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de uma marca pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteBrandResponse.Empty("Ocorreu um erro durante o processo soft delete de uma marca.");
            }
        }
    }
}
