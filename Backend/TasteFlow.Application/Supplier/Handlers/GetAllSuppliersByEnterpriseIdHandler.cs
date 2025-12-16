using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Supplier.Queries;
using TasteFlow.Application.Supplier.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Supplier.Handlers
{
    public class GetAllSuppliersByEnterpriseIdHandler : IRequestHandler<GetAllSuppliersByEnterpriseIdQuery, IEnumerable<GetAllSuppliersByEnterpriseIdResponse>>
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllSuppliersByEnterpriseIdHandler(ISupplierRepository supplierRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _supplierRepository = supplierRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllSuppliersByEnterpriseIdResponse>> Handle(GetAllSuppliersByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _supplierRepository.GetAllSuppliersByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllSuppliersByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todos os fornecedores pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllSuppliersByEnterpriseIdResponse>();
            }
        }
    }
}
