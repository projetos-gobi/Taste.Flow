using AutoMapper;
using MediatR;
using TasteFlow.Application.StockEntryAttachment.Queries;
using TasteFlow.Application.StockEntryAttachment.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.StockEntryAttachment.Handlers
{
    public class GetFileUrlStockEntryAttachmentHandler : IRequestHandler<GetFileUrlStockEntryAttachmentQuery, GetFileUrlStockEntryAttachmentResponse>
    {
        private readonly IStockEntryAttachmentRepository _stockEntryAttachmentRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetFileUrlStockEntryAttachmentHandler(IStockEntryAttachmentRepository stockEntryAttachmentRepository, IFileStorageService fileStorageService, IEventLogger eventLogger, IMapper mapper)
        {
            _stockEntryAttachmentRepository = stockEntryAttachmentRepository;
            _fileStorageService = fileStorageService;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetFileUrlStockEntryAttachmentResponse> Handle(GetFileUrlStockEntryAttachmentQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _stockEntryAttachmentRepository.GetStockEntryAttachmentByIdAsync(request.Id, request.EnterpriseId);

                if (result == null)
                    return null;

                var signedUrl = await _fileStorageService.GeneratePreSignedUrlAsync(result.FilePath, 15);

                var response = new GetFileUrlStockEntryAttachmentResponse();

                response.FileUrl = signedUrl;
                response.Expiry = DateTime.Now.AddMinutes(15);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo criação de URL pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
