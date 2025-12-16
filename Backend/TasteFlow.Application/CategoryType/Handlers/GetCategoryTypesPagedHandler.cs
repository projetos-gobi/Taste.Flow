using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.CategoryType.Queries;
using TasteFlow.Application.CategoryType.Responses;
using TasteFlow.Application.Common;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace TasteFlow.Application.CategoryType.Handlers
{
    public class GetCategoryTypesPagedHandler : IRequestHandler<GetCategoryTypesPagedQuery, PagedResult<GetCategoryTypesPagedResponse>>
    {
        private readonly ICategoryTypeRepository _categoryTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetCategoryTypesPagedHandler(ICategoryTypeRepository categoryTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryTypeRepository = categoryTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetCategoryTypesPagedResponse>> Handle(GetCategoryTypesPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _categoryTypeRepository.GetCategoryTypesPaged(request.EnterpriseId);

                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetCategoryTypesPagedResponse>>(result);

                return new PagedResult<GetCategoryTypesPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de tipo de categoria.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetCategoryTypesPagedResponse>.Empty();
            }
        }
    }
}
