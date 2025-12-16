using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Contracts.ProductAlternative.Request;
using TasteFlow.Application.ProductAlternative.Queries;

namespace TasteFlow.Api.Controllers.ProductAlternative
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductAlternativeController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public ProductAlternativeController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("get-product-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllProductAlternativesByProductId([FromBody] GetAllProductAlternativesByProductIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllProductAlternativesByProductIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

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
