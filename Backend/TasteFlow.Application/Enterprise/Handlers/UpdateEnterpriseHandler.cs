using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Enterprise.Commands;
using TasteFlow.Application.Enterprise.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Application.Enterprise.Handlers
{
    public class UpdateEnterpriseHandler : IRequestHandler<UpdateEnterpriseCommand, UpdateEnterpriseResponse>
    {
        private readonly IEnterpriseRepository _enterpriseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public UpdateEnterpriseHandler(IEnterpriseRepository enterpriseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _enterpriseRepository = enterpriseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateEnterpriseResponse> Handle(UpdateEnterpriseCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var enterprise = _mapper.Map<Domain.Entities.Enterprise>(request.Enterprise);

                var result = await _enterpriseRepository.UpdateEnterpriseAsync(enterprise);

                return new UpdateEnterpriseResponse(result, (result)? "Empresa atualizada com sucesso." : "Não foi possível atualizar a empresa.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de uma empresa pelo ID: {request.Enterprise.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateEnterpriseResponse.Empty("Ocorreu um erro durante o processo atualização de uma empresa.");
            }
        }
    }
}
