using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.PaymentType.Queries;
using TasteFlow.Contracts.PaymentType.Request;

namespace TasteFlow.Api.Controllers.PaymentType
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentTypeController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public PaymentTypeController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("get-all-payment-types-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllPaymentTypesByEnterpriseId([FromBody] GetAllPaymentTypesByEnterpriseIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllPaymentTypesByEnterpriseIdQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
