using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Merchandise.Queries;
using TasteFlow.Application.Merchandise.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Merchandise.Handlers
{
    public class GetAllMerchandisesByEnterpriseIdHandler : IRequestHandler<GetAllMerchandisesByEnterpriseIdQuery, IEnumerable<GetAllMerchandisesByEnterpriseIdResponse>>
    {
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllMerchandisesByEnterpriseIdHandler(IMerchandiseRepository merchandiseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _merchandiseRepository = merchandiseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllMerchandisesByEnterpriseIdResponse>> Handle(GetAllMerchandisesByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _merchandiseRepository.GetAllMerchandisesByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllMerchandisesByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todas mercadorias pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllMerchandisesByEnterpriseIdResponse>();
            }
        }
    }
}
