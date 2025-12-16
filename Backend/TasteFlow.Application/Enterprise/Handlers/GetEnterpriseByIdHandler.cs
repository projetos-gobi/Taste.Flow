using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Enterprise.Queries;
using TasteFlow.Application.Enterprise.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Enterprise.Handlers
{
    public class GetEnterpriseByIdHandler : IRequestHandler<GetEnterpriseByIdQuery, GetEnterpriseByIdResponse>
    {
        private readonly IEnterpriseRepository _enterpriseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public GetEnterpriseByIdHandler(IEnterpriseRepository enterpriseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _enterpriseRepository = enterpriseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetEnterpriseByIdResponse> Handle(GetEnterpriseByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _enterpriseRepository.GetEnterpriseByIdAsync(request.Id);

                var response = _mapper.Map<GetEnterpriseByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de uma empresa pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
