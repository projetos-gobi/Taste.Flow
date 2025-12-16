using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Supplier.Queries;
using TasteFlow.Application.Common;
using TasteFlow.Application.Supplier.Responses;
using Microsoft.EntityFrameworkCore;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Application.Supplier.Handlers
{
    public class GetSuppliersPagedHandler : IRequestHandler<GetSuppliersPagedQuery, PagedResult<GetSuppliersPagedResponse>>
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetSuppliersPagedHandler(ISupplierRepository supplierRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _supplierRepository = supplierRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<PagedResult<GetSuppliersPagedResponse>> Handle(GetSuppliersPagedQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _supplierRepository.GetSuppliersPaged(request.EnterpriseId);

                if (request.Filter.CategoryId.HasValue)
                    query = query.Where(x => x.CategoryId == request.Filter.CategoryId);

                if (request.Filter.PaymentTypeId.HasValue)
                    query = query.Where(x => x.SupplierPaymentTypes.Any(spt => spt.PaymentTypeId == request.Filter.PaymentTypeId.Value));

                if (!string.IsNullOrWhiteSpace(request.Filter.SearchQuery))
                {
                    query = query.Where(e => e.FantasyName.ToLower().Contains(request.Filter.SearchQuery.ToLower()) 
                    || e.SocialReason.ToLower().Contains(request.Filter.SearchQuery.ToLower()) 
                    || e.Cnpj.ToLower().Contains(request.Filter.SearchQuery.ToLower()));
                }

                var result = await query
                    .OrderBy(x => x.CreatedOn)
                    .Skip((request.Query.Page - 1) * request.Query.PageSize)
                    .Take(request.Query.PageSize)
                    .ToListAsync(cancellationToken);

                var totalCount = await query.CountAsync(cancellationToken);

                var response = _mapper.Map<List<GetSuppliersPagedResponse>>(result);

                return new PagedResult<GetSuppliersPagedResponse>(totalCount, response, request.Query.Page, request.Query.PageSize);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo paginação de fornecedores.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return PagedResult<GetSuppliersPagedResponse>.Empty();
            }
        }
    }
}
