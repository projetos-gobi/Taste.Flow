using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.CategoryType.Queries;
using TasteFlow.Application.CategoryType.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.CategoryType.Handlers
{
    public class GetAllCategoryTypesByEnterpriseIdHandler : IRequestHandler<GetAllCategoryTypesByEnterpriseIdQuery, IEnumerable<GetAllCategoryTypesByEnterpriseIdResponse>>
    {
        private readonly ICategoryTypeRepository _categoryTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllCategoryTypesByEnterpriseIdHandler(ICategoryTypeRepository categoryTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryTypeRepository = categoryTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllCategoryTypesByEnterpriseIdResponse>> Handle(GetAllCategoryTypesByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _categoryTypeRepository.GetAllCategoryTypesByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllCategoryTypesByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todos tipo de categoria pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllCategoryTypesByEnterpriseIdResponse>();
            }
        }
    }
}
