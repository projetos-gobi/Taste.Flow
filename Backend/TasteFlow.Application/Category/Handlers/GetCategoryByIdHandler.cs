using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Category.Queries;
using TasteFlow.Application.Category.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Category.Handlers
{
    public class GetCategoryByIdHandler : IRequestHandler<GetCategoryByIdQuery, GetCategoryByIdResponse>
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetCategoryByIdHandler(ICategoryRepository categoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetCategoryByIdResponse> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _categoryRepository.GetCategoryByIdAsync(request.Id, request.EnterpriseId);

                var response = _mapper.Map<GetCategoryByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de uma categoria pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
