using AutoMapper;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.SubCategory.Queries;
using TasteFlow.Application.SubCategory.Responses;

namespace TasteFlow.Application.SubCategory.Handlers
{
    public class CheckSubCategoriesExistHandler : IRequestHandler<CheckSubCategoriesExistQuery, IEnumerable<CheckSubCategoriesExistResponse>>
    {
        private readonly ISubCategoryRepository _subCategoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CheckSubCategoriesExistHandler(ISubCategoryRepository subCategoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _subCategoryRepository = subCategoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CheckSubCategoriesExistResponse>> Handle(CheckSubCategoriesExistQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _subCategoryRepository.GetExistingSubCategoriesAsync(request.SubCategories, request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<CheckSubCategoriesExistResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a verificação de sub-categorias existentes para a empresa {request.EnterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<CheckSubCategoriesExistResponse>();
            }
        }
    }
}
