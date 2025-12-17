using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.Enterprise.Commands;
using TasteFlow.Application.Enterprise.Queries;
using TasteFlow.Contracts.Enterprise.Request;

namespace TasteFlow.Api.Controllers.Enterprise
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EnterpriseController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public EnterpriseController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-enterprise")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateEnterprise([FromBody] CreateEnterpriseRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateEnterpriseCommand>(request);

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-enterprises-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEnterprisesPaged([FromBody] GetEnterprisesPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetEnterprisesPagedQuery>(request);

                var result = await _mediator.Send(query);

                if (result != null)
                {
                    return Response(result);
                }
                else
                {
                    return NotFound();
                }
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpPost("get-enterprise-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEnterpriseById([FromBody] GetEnterpriseByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetEnterpriseByIdQuery>(request);

                var result = await _mediator.Send(query);

                if (result != null)
                {
                    return Response(result);
                }
                else
                {
                    return NotFound();
                }
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpPost("update-enterprise")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateEnterprise([FromBody] UpdateEnterpriseRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateEnterpriseCommand>(request);

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-enterprise")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteEnterprise([FromBody] SoftDeleteEnterpriseRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteEnterpriseCommand>(request);
                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-enterprises-for-user-registration")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAllEnterprisesForUserRegistration()
        {
            try
            {
                var query = new GetAllEnterprisesForUserRegistrationQuery();

                var result = await _mediator.Send(query);

                if (result != null)
                {
                    return Response(result);
                }
                else
                {
                    return NotFound();
                }
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpPost("get-enterprise-detail-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEnterpriseDetailById()
        {
            try
            {
                var query = new GetEnterpriseDetailByIdQuery(EnterpriseIdValue);

                var result = await _mediator.Send(query);

                if (result != null)
                {
                    return Response(result);
                }
                else
                {
                    return NotFound();
                }
            }
            catch
            {
                return NotFound();
            }
        }
    }
}
