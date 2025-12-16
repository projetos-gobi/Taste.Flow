using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.SubCategory.Queries;
using TasteFlow.Application.SubCategory.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.SubCategory.Handlers
{
    public class GetAllSubCategoriesByEnterpriseIdHandler : IRequestHandler<GetAllSubCategoriesByEnterpriseIdQuery, IEnumerable<GetAllSubCategoriesByEnterpriseIdResponse>>
    {
        private readonly ISubCategoryRepository _subCategoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllSubCategoriesByEnterpriseIdHandler(ISubCategoryRepository subCategoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _subCategoryRepository = subCategoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllSubCategoriesByEnterpriseIdResponse>> Handle(GetAllSubCategoriesByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _subCategoryRepository.GetAllSubCategoriesByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllSubCategoriesByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todas as sub-categorias pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllSubCategoriesByEnterpriseIdResponse>();
            }
        }
    }
}
