using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Common;
using TasteFlow.Application.Enterprise.Commands;
using TasteFlow.Application.Enterprise.Responses;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;

namespace TasteFlow.Application.Enterprise.Handlers
{
    public class CreateEnterpriseHandler : IRequestHandler<CreateEnterpriseCommand, CreateEnterpriseResponse>
    {
        private readonly IEnterpriseRepository _enterpriseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public CreateEnterpriseHandler(IEnterpriseRepository enterpriseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _enterpriseRepository = enterpriseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateEnterpriseResponse> Handle(CreateEnterpriseCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var enterprise = _mapper.Map<Domain.Entities.Enterprise>(request.Enterprise);

                var enterpriseExisting = await _enterpriseRepository.GetEnterpriseExistingAsync(enterprise);

                if (enterpriseExisting)
                {
                    return new CreateEnterpriseResponse(false, "Empresa já existe no sistema.");
                }

                var result = await _enterpriseRepository.CreateEnterpriseAsync(enterprise);

                return new CreateEnterpriseResponse(result, ((result)? "Empresa criada com sucesso." : "Não foi possível criar a empresa no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de empresa, CNPJ: {request.Enterprise.Cnpj}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateEnterpriseResponse.Empty("Ocorreu um erro durante o processo de criação de empresa");
            }
        }
    }
}
