using AutoMapper;
using MediatR;
using TasteFlow.Application.CategoryType.Commands;
using TasteFlow.Application.CategoryType.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.CategoryType.Handlers
{
    public class SoftDeleteCategoryTypeHandler : IRequestHandler<SoftDeleteCategoryTypeCommand, SoftDeleteCategoryTypeResponse>
    {
        private readonly ICategoryTypeRepository _categoryTypeRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteCategoryTypeHandler(ICategoryTypeRepository categoryTypeRepository, ICategoryRepository categoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryTypeRepository = categoryTypeRepository;
            _categoryRepository = categoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteCategoryTypeResponse> Handle(SoftDeleteCategoryTypeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var inUse = await _categoryRepository.ExistsByAsync(c => c.CategoryTypeId, request.Id, request.EnterpriseId);

                if (inUse)
                {
                    return new SoftDeleteCategoryTypeResponse(false, "Não é possível deletar o tipo de categoria, pois ele está sendo utilizado em Categorias.");
                }

                var result = await _categoryTypeRepository.SoftDeleteCategoryTypeAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteCategoryTypeResponse(result, (result) ? "Tipo de categoria foi deletado com sucesso." : "Não foi possível deletar o tipo de categoria.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de uma marca pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteCategoryTypeResponse.Empty("Ocorreu um erro durante o processo soft delete de um tipo de categoria.");
            }
        }
    }
}
