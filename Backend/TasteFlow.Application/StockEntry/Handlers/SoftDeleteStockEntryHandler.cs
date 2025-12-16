using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.StockEntry.Commands;
using TasteFlow.Application.StockEntry.Responses;

namespace TasteFlow.Application.StockEntry.Handlers
{
    public class SoftDeleteStockEntryHandler : IRequestHandler<SoftDeleteStockEntryCommand, SoftDeleteStockEntryResponse>
    {
        private readonly IStockEntryRepository _stockEntryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public SoftDeleteStockEntryHandler(IStockEntryRepository stockEntryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _stockEntryRepository = stockEntryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteStockEntryResponse> Handle(SoftDeleteStockEntryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _stockEntryRepository.SoftDeleteStockEntryAsync(request.Id, request.EnterpriseId, Guid.Empty);

                return new SoftDeleteStockEntryResponse(result, (result) ? "Controle de entrada foi deletado com sucesso." : "Não foi possível deletar o controle de entrada.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de um controle de entrada pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteStockEntryResponse.Empty("Ocorreu um erro durante o processo soft delete de um controle de entrada.");
            }
        }
    }
}
