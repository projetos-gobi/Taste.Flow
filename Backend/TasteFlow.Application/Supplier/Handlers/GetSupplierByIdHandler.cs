using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Supplier.Queries;
using TasteFlow.Application.Supplier.Responses;

namespace TasteFlow.Application.Supplier.Handlers
{
    public class GetSupplierByIdHandler : IRequestHandler<GetSupplierByIdQuery, GetSupplierByIdResponse>
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetSupplierByIdHandler(ISupplierRepository supplierRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _supplierRepository = supplierRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetSupplierByIdResponse> Handle(GetSupplierByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _supplierRepository.GetSupplierByIdAsync(request.Id, request.EnterpriseId);

                var response = _mapper.Map<GetSupplierByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um fornecedor pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
