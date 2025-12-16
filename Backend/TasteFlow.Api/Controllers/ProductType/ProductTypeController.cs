using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.ProductType.Commands;
using TasteFlow.Application.ProductType.Queries;
using TasteFlow.Contracts.ProductType.Request;

namespace TasteFlow.Api.Controllers.ProductType
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductTypeController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public ProductTypeController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-product-types-range")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateProductTypesRange([FromBody] CreateProductTypesRangeRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateProductTypesRangeCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-product-types-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetProductTypesPaged([FromBody] GetProductTypesPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetProductTypesPagedQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-product-type-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetProductTypeById([FromBody] GetProductTypeByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetProductTypeByIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-product-type")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateProductType([FromBody] UpdateProductTypeRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateProductTypeCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-product-type")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteProductType([FromBody] SoftDeleteProductTypeRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteProductTypeCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-product-types-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllProductTypesByEnterpriseId([FromBody] GetAllProductTypesByEnterpriseIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllProductTypesByEnterpriseIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("check-product-types-exist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckProductTypesExist([FromBody] CheckProductTypesExistRequest request)
        {
            try
            {
                var query = _mapper.Map<CheckProductTypesExistQuery>(request);
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
