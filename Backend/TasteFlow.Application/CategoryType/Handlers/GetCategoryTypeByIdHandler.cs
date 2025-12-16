using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.CategoryType.Queries;
using TasteFlow.Application.CategoryType.Responses;

namespace TasteFlow.Application.CategoryType.Handlers
{
    public class GetCategoryTypeByIdHandler : IRequestHandler<GetCategoryTypeByIdQuery, GetCategoryTypeByIdResponse>
    {
        private readonly ICategoryTypeRepository _categoryTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetCategoryTypeByIdHandler(ICategoryTypeRepository categoryTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryTypeRepository = categoryTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetCategoryTypeByIdResponse> Handle(GetCategoryTypeByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _categoryTypeRepository.GetCategoryTypeByIdAsync(request.Id, request.EnterpriseId);

                var response = _mapper.Map<GetCategoryTypeByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de um tipo de categoria pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
