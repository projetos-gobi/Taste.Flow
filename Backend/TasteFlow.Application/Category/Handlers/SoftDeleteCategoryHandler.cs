using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Category.Commands;
using TasteFlow.Application.Category.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Category.Handlers
{
    public class SoftDeleteCategoryHandler : IRequestHandler<SoftDeleteCategoryCommand, SoftDeleteCategoryResponse>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IProductIntermediateRepository _productIntermediateRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteCategoryHandler(ICategoryRepository categoryRepository, IMerchandiseRepository merchandiseRepository, IProductIntermediateRepository productIntermediateRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _merchandiseRepository = merchandiseRepository;
            _productIntermediateRepository = productIntermediateRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteCategoryResponse> Handle(SoftDeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var inUse = await _merchandiseRepository.ExistsByAsync(m => m.CategoryId, request.Id, request.EnterpriseId);

                if (inUse)
                {
                    return new SoftDeleteCategoryResponse(false, "Não é possível deletar a categoria, pois ela está sendo utilizada em Mercadorias.");
                }

                var inUseProductIntermediate = await _productIntermediateRepository.ExistsByAsync(x => x.CategoryId, request.Id, request.EnterpriseId);

                if (inUseProductIntermediate)
                {
                    return new SoftDeleteCategoryResponse(false, "Não é possível deletar a categoria, pois ela está sendo utilizada em Produtos Intermediários.");
                }

                var result = await _categoryRepository.SoftDeleteCategoryAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteCategoryResponse(result, (result) ? "Categoria foi deletada com sucesso." : "Não foi possível deletar a categoria.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de uma categoria pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteCategoryResponse.Empty("Ocorreu um erro durante o processo soft delete de uma categoria.");
            }
        }
    }
}
