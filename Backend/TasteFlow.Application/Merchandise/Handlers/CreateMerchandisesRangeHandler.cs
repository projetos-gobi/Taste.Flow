using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Merchandise.Commands;
using TasteFlow.Application.Merchandise.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Merchandise.Handlers
{
    public class CreateMerchandisesRangeHandler : IRequestHandler<CreateMerchandisesRangeCommand, CreateMerchandisesRangeResponse>
    {
        private readonly IMerchandiseRepository _merchandiseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public CreateMerchandisesRangeHandler(IMerchandiseRepository merchandiseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _merchandiseRepository = merchandiseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateMerchandisesRangeResponse> Handle(CreateMerchandisesRangeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var merchandises = _mapper.Map<IEnumerable<Domain.Entities.Merchandise>>(request.Merchandises);

                merchandises.ToList().ForEach(x => x.EnterpriseId = request.EnterpriseId);

                var result = await _merchandiseRepository.CreateMerchandisesRangeAsync(merchandises);

                return new CreateMerchandisesRangeResponse(result, ((result) ? "Mercadorias criadas com sucesso." : "Não foi possível criar as mercadorias no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de mercadoria para empresa.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateMerchandisesRangeResponse.Empty("Ocorreu um erro durante o processo de criação de mercadorias para empresa.");
            }
        }
    }
}
