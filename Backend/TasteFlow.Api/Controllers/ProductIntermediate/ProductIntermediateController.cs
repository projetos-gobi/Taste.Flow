using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.ProductIntermediate.Commands;
using TasteFlow.Application.ProductIntermediate.Queries;
using TasteFlow.Contracts.ProductIntermediate.Request;

namespace TasteFlow.Api.Controllers.ProductIntermediate
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductIntermediateController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public ProductIntermediateController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-product-intermediate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateProductIntermediate([FromBody] CreateProductIntermediateRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateProductIntermediateCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-product-intermediates-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetProductIntermediatesPaged([FromBody] GetProductIntermediatesPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetProductIntermediatesPagedQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-product-intermediate-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetProductIntermediateById([FromBody] GetProductIntermediateByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetProductIntermediateByIdQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-product-intermediate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateProductIntermediate([FromBody] UpdateProductIntermediateRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateProductIntermediateCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-product-intermediate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteProductIntermediate([FromBody] SoftDeleteProductIntermediateRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteProductIntermediateCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-product-intermediates-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllProductIntermediatesByEnterpriseId([FromBody] GetAllProductIntermediatesByEnterpriseIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllProductIntermediatesByEnterpriseIdQuery>(request);
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
