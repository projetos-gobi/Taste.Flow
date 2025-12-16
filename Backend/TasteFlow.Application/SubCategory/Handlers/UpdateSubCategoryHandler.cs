using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.SubCategory.Commands;
using TasteFlow.Application.SubCategory.Responses;

namespace TasteFlow.Application.SubCategory.Handlers
{
    public class UpdateSubCategoryHandler : IRequestHandler<UpdateSubCategoryCommand, UpdateSubCategoryResponse>
    {
        private readonly ISubCategoryRepository _subCategoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateSubCategoryHandler(ISubCategoryRepository subCategoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _subCategoryRepository = subCategoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateSubCategoryResponse> Handle(UpdateSubCategoryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var subCategory = _mapper.Map<Domain.Entities.SubCategory>(request.SubCategory);

                var result = await _subCategoryRepository.UpdateSubCategoryAsync(subCategory, request.EnterpriseId);

                return new UpdateSubCategoryResponse(result, (result) ? "Sub categoria atualizada com sucesso." : "Não foi possível atualizar a sub categoria.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de uma sub categoria pelo ID: {request.SubCategory.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateSubCategoryResponse.Empty("Ocorreu um erro durante o processo atualização de uma sub categoria.");
            }
        }
    }
}
