using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.SubCategory.Commands;
using TasteFlow.Application.SubCategory.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.SubCategory.Handlers
{
    public class CreateSubCategoriesRangeHandler : IRequestHandler<CreateSubCategoriesRangeCommand, CreateSubCategoriesRangeResponse>
    {
        private readonly ISubCategoryRepository _subCategoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateSubCategoriesRangeHandler(ISubCategoryRepository subCategoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _subCategoryRepository = subCategoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateSubCategoriesRangeResponse> Handle(CreateSubCategoriesRangeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var subCategories = _mapper.Map<IEnumerable<Domain.Entities.SubCategory>>(request.SubCategories);

                subCategories.ToList().ForEach(x => x.EnterpriseId = request.EnterpriseId);

                var result = await _subCategoryRepository.CreateSubCategoriesRangeAsync(subCategories);

                return new CreateSubCategoriesRangeResponse(result, ((result) ? "Sub categorias criadas com sucesso." : "Não foi possível criar as sub categorias  no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de sub categorias para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateSubCategoriesRangeResponse.Empty("Ocorreu um erro durante o processo de criação de sub categorias para empresa.");
            }
        }
    }
}
