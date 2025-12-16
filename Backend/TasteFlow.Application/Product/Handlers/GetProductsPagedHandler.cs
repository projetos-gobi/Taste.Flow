using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Product.Queries;
using TasteFlow.Application.Common;
using TasteFlow.Application.Product.Responses;
using Microsoft.EntityFrameworkCore;

namespace TasteFlow.Application.Product.Handlers
{
    public class GetProductsPagedHandler : IRequestHandler<GetProductsPagedQuery, PagedResult<GetProductsPagedResponse>>
    {
        private readonly IProductRepository _productRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetProductsPagedHandler(IProductRepository productRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productRepository = productRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetProductsPagedResponse>> Handle(GetProductsPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _productRepository.GetProductsPaged(request.EnterpriseId);

                if (request.Filter.CategoryId.HasValue)
                    query = query.Where(x => x.CategoryId == request.Filter.CategoryId);

                if (request.Filter.SubCategoryId.HasValue)
                    query = query.Where(x => x.SubCategoryId == request.Filter.SubCategoryId);

                if (request.Filter.MinPrice.HasValue)
                    query = query.Where(x => x.Price >= request.Filter.MinPrice.Value);

                if (request.Filter.MaxPrice.HasValue)
                    query = query.Where(x => x.Price <= request.Filter.MaxPrice.Value);

                if (!string.IsNullOrWhiteSpace(request.Filter.SearchQuery))
                {
                    query = query.Where(e => e.Name.ToLower().Contains(request.Filter.SearchQuery.ToLower()));
                }

                var result = await query
                    .OrderByDescending(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetProductsPagedResponse>>(result);

                return new PagedResult<GetProductsPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de produtos.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetProductsPagedResponse>.Empty();
            }
        }
    }
}
