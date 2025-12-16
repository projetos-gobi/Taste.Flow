using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Supplier.Commands;
using TasteFlow.Application.Supplier.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Supplier.Handlers
{
    public class CreateSupplierHandler : IRequestHandler<CreateSupplierCommand, CreateSupplierResponse>
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateSupplierHandler(ISupplierRepository supplierRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _supplierRepository = supplierRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateSupplierResponse> Handle(CreateSupplierCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var supplier = _mapper.Map<Domain.Entities.Supplier>(request.Supplier);
                supplier.EnterpriseId = request.EnterpriseId;

                var result = await _supplierRepository.CreateSupplierAsync(supplier);

                return new CreateSupplierResponse(result, ((result) ? "Fornecedor criado com sucesso." : "Não foi possível criar o fornecedor no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de um fornecedor para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateSupplierResponse.Empty("Ocorreu um erro durante o processo atualização de uma categoria.");
            }
        }
    }
}
