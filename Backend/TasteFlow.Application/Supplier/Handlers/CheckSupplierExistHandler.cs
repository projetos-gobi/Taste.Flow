using AutoMapper;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Supplier.Queries;
using TasteFlow.Application.Supplier.Responses;

namespace TasteFlow.Application.Supplier.Handlers
{
    public class CheckSupplierExistHandler : IRequestHandler<CheckSupplierExistQuery, IEnumerable<CheckSupplierExistResponse>>
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CheckSupplierExistHandler(ISupplierRepository supplierRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _supplierRepository = supplierRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CheckSupplierExistResponse>> Handle(CheckSupplierExistQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _supplierRepository.GetExistingSuppliersAsync(request.FantasyName, request.Cnpj, request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<CheckSupplierExistResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a verificação de fornecedores existentes para a empresa {request.EnterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<CheckSupplierExistResponse>();
            }
        }
    }
}
