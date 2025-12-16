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
    public class SoftDeleteSupplierHandler : IRequestHandler<SoftDeleteSupplierCommand, SoftDeleteSupplierResponse>
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteSupplierHandler(ISupplierRepository supplierRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _supplierRepository = supplierRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteSupplierResponse> Handle(SoftDeleteSupplierCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _supplierRepository.SoftDeleteSupplierAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteSupplierResponse(result, (result) ? "Fornecedor foi deletado com sucesso." : "Não foi possível deletar o fornecedor.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de um fornecedor pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteSupplierResponse.Empty("Ocorreu um erro durante o processo soft delete de um fornecedor.");
            }
        }
    }
}
