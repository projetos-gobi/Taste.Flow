using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.CategoryType.Commands;
using TasteFlow.Application.CategoryType.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Application.Brand.Responses;

namespace TasteFlow.Application.CategoryType.Handlers
{
    public class UpdateCategoryTypeHandler : IRequestHandler<UpdateCategoryTypeCommand, UpdateCategoryTypeResponse>
    {
        private readonly ICategoryTypeRepository _categoryTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateCategoryTypeHandler(ICategoryTypeRepository categoryTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryTypeRepository = categoryTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateCategoryTypeResponse> Handle(UpdateCategoryTypeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var categoryType = _mapper.Map<Domain.Entities.CategoryType>(request.CategoryType);

                var result = await _categoryTypeRepository.UpdateCategoryTypeAsync(categoryType, request.EnterpriseId);

                return new UpdateCategoryTypeResponse(result, (result) ? "Tipo de categoria atualizado com sucesso." : "Não foi possível atualizar o tipo de categoria.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de um tipo de categoria ID: {request.CategoryType.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateCategoryTypeResponse.Empty("Ocorreu um erro durante o processo de atualização de um tipo de categoria.");
            }
        }
    }
}
