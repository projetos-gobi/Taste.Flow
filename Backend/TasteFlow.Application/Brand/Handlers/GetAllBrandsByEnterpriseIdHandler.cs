using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Brand.Queries;
using TasteFlow.Application.Brand.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Brand.Handlers
{
    public class GetAllBrandsByEnterpriseIdHandler : IRequestHandler<GetAllBrandsByEnterpriseIdQuery, IEnumerable<GetAllBrandsByEnterpriseIdResponse>>
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllBrandsByEnterpriseIdHandler(IBrandRepository brandRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllBrandsByEnterpriseIdResponse>> Handle(GetAllBrandsByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _brandRepository.GetAllBrandsByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllBrandsByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todas as marcas pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllBrandsByEnterpriseIdResponse>();
            }
        }
    }
}
