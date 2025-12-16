using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Category.Queries;
using TasteFlow.Application.Category.Responses;

namespace TasteFlow.Application.Category.Handlers
{
    public class GetAllCategoriesByEnterpriseIdHandler : IRequestHandler<GetAllCategoriesByEnterpriseIdQuery, IEnumerable<GetAllCategoriesByEnterpriseIdResponse>>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllCategoriesByEnterpriseIdHandler(ICategoryRepository categoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllCategoriesByEnterpriseIdResponse>> Handle(GetAllCategoriesByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _categoryRepository.GetAllCategoriesByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllCategoriesByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todas as categorias pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllCategoriesByEnterpriseIdResponse>();
            }
        }
    }
}
