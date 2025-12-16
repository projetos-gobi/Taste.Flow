using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.ProductType.Queries;
using TasteFlow.Application.ProductType.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace TasteFlow.Application.ProductType.Handlers
{
    public class GetProductTypesPagedHandler : IRequestHandler<GetProductTypesPagedQuery, PagedResult<GetProductTypesPagedResponse>>
    {
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetProductTypesPagedHandler(IProductTypeRepository productTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetProductTypesPagedResponse>> Handle(GetProductTypesPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _productTypeRepository.GetProductTypesPaged(request.EnterpriseId);

                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetProductTypesPagedResponse>>(result);

                return new PagedResult<GetProductTypesPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de tipos de produtos.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetProductTypesPagedResponse>.Empty();
            }
        }
    }
}
