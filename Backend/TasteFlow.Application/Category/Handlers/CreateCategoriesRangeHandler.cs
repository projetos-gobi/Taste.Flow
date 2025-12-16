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
    public class CreateCategoriesRangeHandler : IRequestHandler<CreateCategoriesRangeCommand, CreateCategoriesRangeResponse>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateCategoriesRangeHandler(ICategoryRepository categoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateCategoriesRangeResponse> Handle(CreateCategoriesRangeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var categories = _mapper.Map<IEnumerable<Domain.Entities.Category>>(request.Categories);

                categories.ToList().ForEach(x => x.EnterpriseId = request.EnterpriseId);

                var result = await _categoryRepository.CreateCategoriesRangeAsync(categories);

                return new CreateCategoriesRangeResponse(result, ((result) ? "Categorias criadas com sucesso." : "Não foi possível criar as categorias no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de categorias para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateCategoriesRangeResponse.Empty("Ocorreu um erro durante o processo de criação de categorias para empresa.");
            }
        }
    }
}
