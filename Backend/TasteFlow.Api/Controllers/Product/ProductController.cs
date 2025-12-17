using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.Product.Commands;
using TasteFlow.Application.Product.Queries;
using TasteFlow.Contracts.Product.Request;

namespace TasteFlow.Api.Controllers.Product
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public ProductController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-product")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateProductCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-products-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetProductsPaged([FromBody] GetProductsPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetProductsPagedQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-product-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetProductById([FromBody] GetProductByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetProductByIdQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-product")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateProductCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-product")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteProduct([FromBody] SoftDeleteProductRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteProductCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-product-by-search-term")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllProductsBySearchTerm([FromBody] GetAllProductsBySearchTermRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllProductsBySearchTermQuery>(request);
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
