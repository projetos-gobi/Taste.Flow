using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.Supplier.Commands;
using TasteFlow.Application.Supplier.Queries;
using TasteFlow.Contracts.Supplier.Request;

namespace TasteFlow.Api.Controllers.Supplier
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SupplierController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public SupplierController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }


        [HttpPost("create-supplier")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateSupplier([FromBody] CreateSupplierRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateSupplierCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-suppliers-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetSuppliersPaged([FromBody] GetSuppliersPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetSuppliersPagedQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-supplier-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetSupplierById([FromBody] GetSupplierByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetSupplierByIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-supplier")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateSupplier([FromBody] UpdateSupplierRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateSupplierCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-supplier")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteSupplier([FromBody] SoftDeleteSupplierRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteSupplierCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-suppliers-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllSuppliersByEnterpriseId([FromBody] GetAllSuppliersByEnterpriseIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllSuppliersByEnterpriseIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("check-supplier-exist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckSupplierExist([FromBody] CheckSupplierExistRequest request)
        {
            try
            {
                var query = _mapper.Map<CheckSupplierExistQuery>(request);
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
