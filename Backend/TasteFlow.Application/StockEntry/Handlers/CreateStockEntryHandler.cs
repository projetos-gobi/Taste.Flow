using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.StockEntry.Commands;
using TasteFlow.Application.StockEntry.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.StockEntry.Handlers
{
    public class CreateStockEntryHandler : IRequestHandler<CreateStockEntryCommand, CreateStockEntryResponse>
    {
        private readonly IStockEntryRepository _stockEntryRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateStockEntryHandler(IStockEntryRepository stockEntryRepository, IFileStorageService fileStorageService, IEventLogger eventLogger, IMapper mapper)
        {
            _stockEntryRepository = stockEntryRepository;
            _fileStorageService = fileStorageService;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateStockEntryResponse> Handle(CreateStockEntryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.StockEntry.StockEntryAttachments.Count > 0)
                {
                    foreach (var attachment in request.StockEntry.StockEntryAttachments)
                    {
                        await using var stream = new MemoryStream(attachment.File);

                        var fileUrl = await _fileStorageService.UploadFileAsync(request.EnterpriseId, attachment.FileName, stream, attachment.FileExtension, cancellationToken);

                        attachment.FilePath = fileUrl;
                    }
                }

                var stockEntry = _mapper.Map<Domain.Entities.StockEntry>(request.StockEntry);
                stockEntry.EnterpriseId = request.EnterpriseId;

                var result = await _stockEntryRepository.CreateStockEntryAsync(stockEntry);

                return new CreateStockEntryResponse(result, ((result) ? "Entrada de estoque criada com sucesso." : "Não foi possível criar entrada de estoque no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de entrada de estoque para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateStockEntryResponse.Empty("Ocorreu um erro durante o processo de criação de itens para empresa.");
            }
        }
    }
}
