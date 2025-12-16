using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Category.Commands;
using TasteFlow.Application.Category.Responses;

namespace TasteFlow.Application.Category.Handlers
{
    public class UpdateCategoryHandler : IRequestHandler<UpdateCategoryCommand, UpdateCategoryResponse>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateCategoryHandler(ICategoryRepository categoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateCategoryResponse> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var category = _mapper.Map<Domain.Entities.Category>(request.Category);

                var result = await _categoryRepository.UpdateCategoryAsync(category, request.EnterpriseId);

                return new UpdateCategoryResponse(result, (result) ? "Categoria atualizada com sucesso." : "Não foi possível atualizar a categoria.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de uma categoria ID: {request.Category.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateCategoryResponse.Empty("Ocorreu um erro durante o processo atualização de uma categoria.");
            }
        }
    }
}
