using AutoMapper;
using MediatR;
using TasteFlow.Application.CategoryType.Queries;
using TasteFlow.Application.CategoryType.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.CategoryType.Handlers
{
    public class CheckCategoryTypesExistHandler : IRequestHandler<CheckCategoryTypesExistQuery, IEnumerable<CheckCategoryTypesExistResponse>>
    {
        private readonly ICategoryTypeRepository _categoryTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CheckCategoryTypesExistHandler(ICategoryTypeRepository categoryTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryTypeRepository = categoryTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CheckCategoryTypesExistResponse>> Handle(CheckCategoryTypesExistQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _categoryTypeRepository.GetExistingCategoryTypesAsync(request.CategoryTypes, request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<CheckCategoryTypesExistResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a verificação de tipos de categorias existentes para a empresa {request.EnterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<CheckCategoryTypesExistResponse>();
            }
        }
    }
}
