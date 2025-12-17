using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.Item.Commands;
using TasteFlow.Application.Item.Queries;
using TasteFlow.Contracts.Item.Request;

namespace TasteFlow.Api.Controllers.Item
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public ItemController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-items-range")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateItemsRange([FromBody] CreateItemsRangeRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateItemsRangeCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-items-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetItemsPaged([FromBody] GetItemsPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetItemsPagedQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-item-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetItemById([FromBody] GetItemByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetItemByIdQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-item")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateItem([FromBody] UpdateItemRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateItemCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-item")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteItem([FromBody] SoftDeleteItemRequest request)
        {
            try
            { 
                var command = _mapper.Map<SoftDeleteItemCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-items-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllItemsByEnterpriseId([FromBody] GetAllItemsByEnterpriseIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllItemsByEnterpriseIdQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("check-items-exist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckItemsExist([FromBody] CheckItemsExistRequest request)
        {
            try
            {
                var query = _mapper.Map<CheckItemsExistQuery>(request);
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
