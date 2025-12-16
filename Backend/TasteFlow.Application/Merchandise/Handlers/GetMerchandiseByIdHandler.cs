using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Merchandise.Queries;
using TasteFlow.Application.Merchandise.Responses;

namespace TasteFlow.Application.Merchandise.Handlers
{
    public class GetMerchandiseByIdHandler : IRequestHandler<GetMerchandiseByIdQuery, GetMerchandiseByIdResponse>
    {
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetMerchandiseByIdHandler(IMerchandiseRepository merchandiseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _merchandiseRepository = merchandiseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetMerchandiseByIdResponse> Handle(GetMerchandiseByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _merchandiseRepository.GetMerchandiseByIdAsync(request.Id, request.EnterpriseId);

                var response = _mapper.Map<GetMerchandiseByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar uma mercadoria pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
