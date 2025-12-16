using AutoMapper;
using MediatR;
using TasteFlow.Application.Brand.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Application.Brand.Queries;

namespace TasteFlow.Application.Brand.Handlers
{
    public class CheckBrandsExistHandler : IRequestHandler<CheckBrandsExistQuery, IEnumerable<CheckBrandsExistResponse>>
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CheckBrandsExistHandler(IBrandRepository brandRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CheckBrandsExistResponse>> Handle(CheckBrandsExistQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _brandRepository.GetExistingBrandsAsync(request.Brands, request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<CheckBrandsExistResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a verificação de marcas existentes para a empresa {request.EnterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<CheckBrandsExistResponse>();
            }
        }
    }
}
