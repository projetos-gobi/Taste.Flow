using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.PaymentType.Queries;
using TasteFlow.Application.PaymentType.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.PaymentType.Handlers
{
    public class GetAllPaymentTypesByEnterpriseIdHandler : IRequestHandler<GetAllPaymentTypesByEnterpriseIdQuery, IEnumerable<GetAllPaymentTypesByEnterpriseIdResponse>>
    {
        private readonly IPaymentTypeRepository _paymentTypeRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllPaymentTypesByEnterpriseIdHandler(IPaymentTypeRepository paymentTypeRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _paymentTypeRepository = paymentTypeRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllPaymentTypesByEnterpriseIdResponse>> Handle(GetAllPaymentTypesByEnterpriseIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _paymentTypeRepository.GetAllPaymentTypesByEnterpriseIdAsync(request.EnterpriseId);

                var response = _mapper.Map<IEnumerable<GetAllPaymentTypesByEnterpriseIdResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todas as formas de pagamento pelo EnterpriseId: {request.EnterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllPaymentTypesByEnterpriseIdResponse>();
            }
        }
    }
}
