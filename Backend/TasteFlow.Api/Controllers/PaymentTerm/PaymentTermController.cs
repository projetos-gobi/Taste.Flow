using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.PaymentTerm.Queries;

namespace TasteFlow.Api.Controllers.PaymentTerm
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentTermController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public PaymentTermController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("get-all-payment-terms")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllPaymentTerms()
        {
            try
            {
                var query = new GetAllPaymentTermsQuery();

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
