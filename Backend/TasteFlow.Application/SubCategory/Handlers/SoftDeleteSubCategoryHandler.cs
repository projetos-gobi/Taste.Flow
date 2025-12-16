using AutoMapper;
using MediatR;
using TasteFlow.Application.SubCategory.Commands;
using TasteFlow.Application.SubCategory.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.SubCategory.Handlers
{
    public class SoftDeleteSubCategoryHandler : IRequestHandler<SoftDeleteSubCategoryCommand, SoftDeleteSubCategoryResponse>
    {
        private readonly ISubCategoryRepository _subCategoryRepository;
        private readonly ISupplierRepository _supplierRepository;
        private readonly IProductIntermediateRepository _productIntermediateRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteSubCategoryHandler(ISubCategoryRepository subCategoryRepository, ISupplierRepository supplierRepository, IProductIntermediateRepository productIntermediateRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _subCategoryRepository = subCategoryRepository;
            _supplierRepository = supplierRepository;
            _productIntermediateRepository = productIntermediateRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteSubCategoryResponse> Handle(SoftDeleteSubCategoryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var inUse = await _supplierRepository.ExistsByAsync(m => m.SubCategoryId, request.Id, request.EnterpriseId);

                if (inUse)
                {
                    return new SoftDeleteSubCategoryResponse(false, "Não é possível deletar a sub categoria, pois ela está sendo utilizada por algum fornecedor.");
                }

                var inUseProductIntermediate = await _productIntermediateRepository.ExistsByAsync(x => x.SubCategoryId, request.Id, request.EnterpriseId);

                if (inUseProductIntermediate)
                {
                    return new SoftDeleteSubCategoryResponse(false, "Não é possível deletar a  sub categoria, pois ela está sendo utilizada em Produtos Intermediários.");
                }

                var result = await _subCategoryRepository.SoftDeleteSubCategoryAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteSubCategoryResponse(result, (result) ? "Sub categoria foi deletada com sucesso." : "Não foi possível deletar a sub categoria.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de uma sub categoria pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteSubCategoryResponse.Empty("Ocorreu um erro durante o processo soft delete de uma sub categoria.");
            }
        }
    }
}
