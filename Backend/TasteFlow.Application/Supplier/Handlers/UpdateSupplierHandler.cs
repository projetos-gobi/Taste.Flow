using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Supplier.Commands;
using TasteFlow.Application.Supplier.Responses;

namespace TasteFlow.Application.Supplier.Handlers
{
    public class UpdateSupplierHandler : IRequestHandler<UpdateSupplierCommand, UpdateSupplierResponse>
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateSupplierHandler(ISupplierRepository supplierRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _supplierRepository = supplierRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateSupplierResponse> Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var supplier = _mapper.Map<Domain.Entities.Supplier>(request.Supplier);

                var result = await _supplierRepository.UpdateSupplierAsync(supplier, request.EnterpriseId);

                return new UpdateSupplierResponse(result, (result) ? "Fornecedor atualizado com sucesso." : "Não foi possível atualizar o fornecedor.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de um fornecedor ID: {request.Supplier.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateSupplierResponse.Empty("Ocorreu um erro durante o processo atualização de um fornecedor.");
            }
        }
    }
}
