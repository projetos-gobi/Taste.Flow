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

namespace TasteFlow.Application.Brand.Handlers
{
    public class GetBrandByIdHandler : IRequestHandler<GetBrandByIdQuery, GetBrandByIdResponse>
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetBrandByIdHandler(IBrandRepository brandRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetBrandByIdResponse> Handle(GetBrandByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _brandRepository.GetBrandByIdAsync(request.Id, request.EnterpriseId);

                var response = _mapper.Map<GetBrandByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de uma marca pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
