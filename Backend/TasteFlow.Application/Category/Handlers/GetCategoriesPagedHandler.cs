using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Application.Category.Queries;
using TasteFlow.Application.Category.Responses;
using TasteFlow.Application.Common;
using TasteFlow.Application.Brand.Responses;
using Microsoft.EntityFrameworkCore;

namespace TasteFlow.Application.Category.Handlers
{
    public class GetCategoriesPagedHandler : IRequestHandler<GetCategoriesPagedQuery, PagedResult<GetCategoriesPagedResponse>>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetCategoriesPagedHandler(ICategoryRepository categoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetCategoriesPagedResponse>> Handle(GetCategoriesPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _categoryRepository.GetCategoriesPaged(request.EnterpriseId);

                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetCategoriesPagedResponse>>(result);

                return new PagedResult<GetCategoriesPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de categorias.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetCategoriesPagedResponse>.Empty();
            }
        }
    }
}
