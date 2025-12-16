using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.ProductIntermediate.Queries;
using TasteFlow.Application.Common;
using TasteFlow.Application.ProductIntermediate.Responses;
using Microsoft.EntityFrameworkCore;

namespace TasteFlow.Application.ProductIntermediate.Handlers
{
    public class GetProductIntermediatesPagedHandler : IRequestHandler<GetProductIntermediatesPagedQuery, PagedResult<GetProductIntermediatesPagedResponse>>
    {
        private readonly IProductIntermediateRepository _productIntermediateRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetProductIntermediatesPagedHandler(IProductIntermediateRepository productIntermediateRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productIntermediateRepository = productIntermediateRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetProductIntermediatesPagedResponse>> Handle(GetProductIntermediatesPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _productIntermediateRepository.GetProductIntermediatesPaged(request.EnterpriseId);

                if (request.Filter.CategoryId.HasValue)
                    query = query.Where(x => x.CategoryId == request.Filter.CategoryId);

                if (request.Filter.SubCategoryId.HasValue)
                    query = query.Where(x => x.SubCategoryId == request.Filter.SubCategoryId);

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

                var response = _mapper.Map<List<GetProductIntermediatesPagedResponse>>(result);

                return new PagedResult<GetProductIntermediatesPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de produtos intermediários.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetProductIntermediatesPagedResponse>.Empty();
            }
        }
    }
}
