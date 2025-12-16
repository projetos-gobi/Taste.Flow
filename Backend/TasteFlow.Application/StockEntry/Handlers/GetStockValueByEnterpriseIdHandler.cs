using AutoMapper;
using MediatR;
using TasteFlow.Application.StockEntry.Queries;
using TasteFlow.Application.StockEntry.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.StockEntry.Handlers
{
    public class GetStockValueByEnterpriseIdHandler : IRequestHandler<GetStockValueByEnterpriseIdQuery, IEnumerable<GetStockValueByEnterpriseIdResponse>>
    {
        private readonly IStockEntryRepository _stockEntryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetStockValueByEnterpriseIdHandler(IStockEntryRepository stockEntryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _stockEntryRepository = stockEntryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetStockValueByEnterpriseIdResponse>> Handle(GetStockValueByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var stockEntries = await _stockEntryRepository.GetStockValueByEnterpriseIdAsync(request.EnterpriseId);

                if (!stockEntries.Any())
                    return Enumerable.Empty<GetStockValueByEnterpriseIdResponse>();

                var stockValues = stockEntries
                    .SelectMany(se => se.StockEntryItems)
                    .Where(item => item.IsActive && !item.IsDeleted)
                    .GroupBy(item => item.MerchandiseId)
                    .Select(g => new GetStockValueByEnterpriseIdResponse
                    {
                        MerchandiseId = g.Key,
                        MerchandiseName = "Produto" ?? string.Empty,
                        AverageValue = Math.Round(g.Sum(item => item.TotalAmount) / g.Sum(item => item.Quantity), 2, MidpointRounding.AwayFromZero)
                    })
                    .ToList();

                return stockValues;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao processar a consulta de valores de estoque para a empresa com ID {request.EnterpriseId}.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetStockValueByEnterpriseIdResponse>();
            }
        }
    }
}
