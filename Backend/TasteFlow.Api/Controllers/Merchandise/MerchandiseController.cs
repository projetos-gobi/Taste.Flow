using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.Merchandise.Commands;
using TasteFlow.Application.Merchandise.Queries;
using TasteFlow.Contracts.Merchandise.Request;

namespace TasteFlow.Api.Controllers.Merchandise
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MerchandiseController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public MerchandiseController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-merchandises-range")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateMerchandisesRange([FromBody] CreateMerchandisesRangeRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateMerchandisesRangeCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-merchandises-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetMerchandisesPaged([FromBody] GetMerchandisesPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetMerchandisesPagedQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-merchandise-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetMerchandiseById([FromBody] GetMerchandiseByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetMerchandiseByIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-merchandise")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateMerchandise([FromBody] UpdateMerchandiseRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateMerchandiseCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-merchandise")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteMerchandise([FromBody] SoftDeleteMerchandiseRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteMerchandiseCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-merchandises-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllMerchandisesByEnterpriseId([FromBody] GetAllMerchandisesByEnterpriseIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllMerchandisesByEnterpriseIdQuery>(request);
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
