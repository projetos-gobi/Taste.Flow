using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.StockEntry.Queries;
using TasteFlow.Application.Common;
using TasteFlow.Application.StockEntry.Responses;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TasteFlow.Application.StockEntry.Handlers
{
    public class GetStockEntriesPagedHandler : IRequestHandler<GetStockEntriesPagedQuery, PagedResult<GetStockEntriesPagedResponse>>
    {
        private readonly IStockEntryRepository _stockEntryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetStockEntriesPagedHandler(IStockEntryRepository stockEntryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _stockEntryRepository = stockEntryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetStockEntriesPagedResponse>> Handle(GetStockEntriesPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _stockEntryRepository.GetStockEntriesPaged(request.EnterpriseId);

                if (request.Filter.PurchaseDate.HasValue)
                {
                    var date = request.Filter.PurchaseDate.Value.Date;
                    query = query.Where(x => x.PurchaseDate >= date && x.PurchaseDate < date.AddDays(1));
                }

                if (request.Filter.ExpectedDeliveryDate.HasValue)
                {
                    var date = request.Filter.ExpectedDeliveryDate.Value.Date;
                    query = query.Where(x => x.ExpectedDeliveryDate >= date && x.ExpectedDeliveryDate < date.AddDays(1));
                }

                if (request.Filter.TotalAmount.HasValue)
                    query = query.Where(x => x.TotalAmount == request.Filter.TotalAmount);

                if (!string.IsNullOrWhiteSpace(request.Filter.SearchQuery))
                {
                    var search = request.Filter.SearchQuery;
                    query = query.Where(x =>
                        x.Supplier.FantasyName.Contains(search) ||
                        x.InvoiceNumber.Contains(search) || 
                        x.StockEntryItems.Any(i => i.Merchandise.Item.Name.Contains(search) || i.Merchandise.Brand.Name.Contains(search))
                    );
                }

                var result = await query
                    .OrderByDescending(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetStockEntriesPagedResponse>>(result);

                return new PagedResult<GetStockEntriesPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de estoque de entrada.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetStockEntriesPagedResponse>.Empty();
            }
        }
    }
}
