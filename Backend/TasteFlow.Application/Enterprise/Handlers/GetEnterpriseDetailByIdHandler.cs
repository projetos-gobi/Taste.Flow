using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using MediatR;
using TasteFlow.Application.Enterprise.Queries;
using TasteFlow.Application.Enterprise.Responses;

namespace TasteFlow.Application.Enterprise.Handlers
{
    public class GetEnterpriseDetailByIdHandler : IRequestHandler<GetEnterpriseDetailByIdQuery, GetEnterpriseDetailByIdResponse>
    {
        private readonly IEnterpriseRepository _enterpriseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public GetEnterpriseDetailByIdHandler(IEnterpriseRepository enterpriseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _enterpriseRepository = enterpriseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<GetEnterpriseDetailByIdResponse> Handle(GetEnterpriseDetailByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _enterpriseRepository.GetEnterpriseDetailByIdAsync(request.Id);

                var response = _mapper.Map<GetEnterpriseDetailByIdResponse>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar detalhes de uma empresa pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }
    }
}
