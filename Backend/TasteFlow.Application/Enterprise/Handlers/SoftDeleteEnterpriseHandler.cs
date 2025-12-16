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

namespace TasteFlow.Application.Enterprise.Handlers
{
    public class SoftDeleteEnterpriseHandler : IRequestHandler<SoftDeleteEnterpriseCommand, SoftDeleteEnterpriseResponse>
    {
        private readonly IEnterpriseRepository _enterpriseRepository;
        private readonly IUserEnterpriseRepository _userEnterpriseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public SoftDeleteEnterpriseHandler(IEnterpriseRepository enterpriseRepository, IUserEnterpriseRepository userEnterpriseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _enterpriseRepository = enterpriseRepository;
            _userEnterpriseRepository = userEnterpriseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteEnterpriseResponse> Handle(SoftDeleteEnterpriseCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var activeLicensesCount = await _userEnterpriseRepository.GetActiveLicensesCountByEnterpriseIdAsync(request.Id);

                if (activeLicensesCount > 0)
                {
                    return new SoftDeleteEnterpriseResponse(false, $"A empresa não pode ser excluída pois possui {activeLicensesCount} licença(s) ativa(s).");
                }

                var result = await _enterpriseRepository.SoftDeleteEnterpriseAsync(request.Id, Guid.Empty);

                return new SoftDeleteEnterpriseResponse(result, (result) ? "Empresa foi deletada com sucesso." : "Não foi possível deletar a empresa.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de uma empresa pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteEnterpriseResponse.Empty("Ocorreu um erro durante o processo soft delete de uma empresa.");
            }
        }
    }
}
