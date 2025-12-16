using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.PaymentTerm.Queries;
using TasteFlow.Application.PaymentTerm.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.PaymentTerm.Handlers
{
    public class GetAllPaymentTermsHandler : IRequestHandler<GetAllPaymentTermsQuery, IEnumerable<GetAllPaymentTermsResponse>>
    {
        private readonly IPaymentTermRepository _paymentTermRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;

        public GetAllPaymentTermsHandler(IPaymentTermRepository paymentTermRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _paymentTermRepository = paymentTermRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetAllPaymentTermsResponse>> Handle(GetAllPaymentTermsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _paymentTermRepository.GetAllPaymentTermsAsync();

                var response = _mapper.Map<IEnumerable<GetAllPaymentTermsResponse>>(result);

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar todos os prazos de pagamento";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<GetAllPaymentTermsResponse>();
            }
        }
    }
}
