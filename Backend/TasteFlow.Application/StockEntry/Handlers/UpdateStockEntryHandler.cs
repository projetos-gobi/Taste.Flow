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
    public class UpdateStockEntryHandler : IRequestHandler<UpdateStockEntryCommand, UpdateStockEntryResponse>
    {
        private readonly IStockEntryRepository _stockEntryRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public UpdateStockEntryHandler(IStockEntryRepository stockEntryRepository, IFileStorageService fileStorageService, IEventLogger eventLogger, IMapper mapper)
        {
            _stockEntryRepository = stockEntryRepository;
            _fileStorageService = fileStorageService;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateStockEntryResponse> Handle(UpdateStockEntryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.StockEntry.StockEntryAttachments.Count > 0)
                {
                    foreach (var attachment in request.StockEntry.StockEntryAttachments.Where(x => x.Id == Guid.Empty))
                    {
                        await using var stream = new MemoryStream(attachment.File);

                        var fileUrl = await _fileStorageService.UploadFileAsync(request.EnterpriseId, attachment.FileName, stream, attachment.FileExtension, cancellationToken);

                        attachment.FilePath = fileUrl;
                    }
                }

                var stockEntry = _mapper.Map<Domain.Entities.StockEntry>(request.StockEntry);

                var result = await _stockEntryRepository.UpdateStockEntryAsync(stockEntry, request.EnterpriseId);

                return new UpdateStockEntryResponse(result, (result) ? "Controle de entrada atualizado com sucesso." : "Não foi possível atualizar o controle de entrada.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de controle de entrada pelo ID: {request.StockEntry.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateStockEntryResponse.Empty("Ocorreu um erro durante o processo atualização de controle de entrada.");
            }
        }
    }
}
