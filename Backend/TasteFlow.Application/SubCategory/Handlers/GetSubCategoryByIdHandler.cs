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
    public class GetSubCategoryByIdHandler : IRequestHandler<GetSubCategoryByIdQuery, GetSubCategoryByIdResponse>
    {
        private readonly ISubCategoryRepository _subCategoryRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetSubCategoryByIdHandler(ISubCategoryRepository subCategoryRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _subCategoryRepository = subCategoryRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetSubCategoryByIdResponse> Handle(GetSubCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _subCategoryRepository.GetSubCategoryByIdAsync(request.Id, request.EnterpriseId);

                var response = _mapper.Map<GetSubCategoryByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de uma sub categoria pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
