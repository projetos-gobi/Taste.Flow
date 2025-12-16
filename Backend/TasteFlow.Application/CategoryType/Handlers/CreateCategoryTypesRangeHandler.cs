using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.CategoryType.Commands;
using TasteFlow.Application.CategoryType.Responses;

namespace TasteFlow.Application.CategoryType.Handlers
{
    public class CreateCategoryTypesRangeHandler : IRequestHandler<CreateCategoryTypesRangeCommand, CreateCategoryTypesRangeResponse>
    {
        private readonly ICategoryTypeRepository _categoryTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateCategoryTypesRangeHandler(ICategoryTypeRepository categoryTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryTypeRepository = categoryTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateCategoryTypesRangeResponse> Handle(CreateCategoryTypesRangeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var categoryTypes = _mapper.Map<IEnumerable<Domain.Entities.CategoryType>>(request.CategoryTypes);

                categoryTypes.ToList().ForEach(x => x.EnterpriseId = request.EnterpriseId);

                var result = await _categoryTypeRepository.CreateCategoryTypesRangeAsync(categoryTypes);

                return new CreateCategoryTypesRangeResponse(result, ((result) ? "Tipos de categorias criados com sucesso." : "Não foi possível criar os tipos de categoria no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de tipos de categoria para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateCategoryTypesRangeResponse.Empty("Ocorreu um erro durante o processo de criação de tipos de categoria para empresa.");
            }
        }
    }
}
