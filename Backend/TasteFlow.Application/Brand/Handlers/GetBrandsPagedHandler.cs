using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Brand.Queries;
using TasteFlow.Application.Brand.Responses;
using TasteFlow.Application.Common;
using Microsoft.EntityFrameworkCore;

namespace TasteFlow.Application.Brand.Handlers
{
    public class GetBrandsPagedHandler : IRequestHandler<GetBrandsPagedQuery, PagedResult<GetBrandsPagedResponse>>
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetBrandsPagedHandler(IBrandRepository brandRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetBrandsPagedResponse>> Handle(GetBrandsPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _brandRepository.GetBrandsPaged(request.EnterpriseId);

                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetBrandsPagedResponse>>(result);

                return new PagedResult<GetBrandsPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de marcas.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetBrandsPagedResponse>.Empty();
            }
        }
    }
}
