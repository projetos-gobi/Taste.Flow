using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.SubCategory.Queries;
using TasteFlow.Application.SubCategory.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace TasteFlow.Application.SubCategory.Handlers
{
    public class GetSubCategoriesPagedHandler : IRequestHandler<GetSubCategoriesPagedQuery, PagedResult<GetSubCategoriesPagedResponse>>
    {
        private readonly ISubCategoryRepository _subCategoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetSubCategoriesPagedHandler(ISubCategoryRepository subCategoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _subCategoryRepository = subCategoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetSubCategoriesPagedResponse>> Handle(GetSubCategoriesPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _subCategoryRepository.GetSubCategoriesPaged(request.EnterpriseId);

                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetSubCategoriesPagedResponse>>(result);

                return new PagedResult<GetSubCategoriesPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de sub categoria.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetSubCategoriesPagedResponse>.Empty();
            }
        }
    }
}
