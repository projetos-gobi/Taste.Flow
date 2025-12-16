using AutoMapper;
using MediatR;
using TasteFlow.Application.Category.Queries;
using TasteFlow.Application.Category.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Category.Handlers
{
    public class CheckCategoriesExistHandler : IRequestHandler<CheckCategoriesExistQuery, IEnumerable<CheckCategoriesExistResponse>>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CheckCategoriesExistHandler(ICategoryRepository categoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CheckCategoriesExistResponse>> Handle(CheckCategoriesExistQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _categoryRepository.GetExistingCategoriesAsync(request.Categories, request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<CheckCategoriesExistResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a verificação de categorias existentes para a empresa {request.EnterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<CheckCategoriesExistResponse>();
            }
        }
    }
}
