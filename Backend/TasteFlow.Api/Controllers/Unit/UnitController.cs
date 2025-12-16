using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.Unit.Commands;
using TasteFlow.Application.Unit.Queries;
using TasteFlow.Contracts.Unit.Request;

namespace TasteFlow.Api.Controllers.Unit
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UnitController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public UnitController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-units-range")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateUnitsRange([FromBody] CreateUnitsRangeRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateUnitsRangeCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-units-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUnitsPaged([FromBody] GetUnitsPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetUnitsPagedQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-unit-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUnitById([FromBody] GetUnitByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetUnitByIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-unit")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateUnit([FromBody] UpdateUnitRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateUnitCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-unit")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteUnit([FromBody] SoftDeleteUnitRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteUnitCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-units-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllUnitsByEnterpriseId([FromBody] GetAllUnitsByEnterpriseIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllUnitsByEnterpriseIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("check-units-exist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckUnitsExist([FromBody] CheckUnitsExistRequest request)
        {
            try
            {
                var query = _mapper.Map<CheckUnitsExistQuery>(request);
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
