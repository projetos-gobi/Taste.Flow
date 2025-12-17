using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.StockEntry.Commands;
using TasteFlow.Application.StockEntry.Queries;
using TasteFlow.Contracts.StockEntry.Request;

namespace TasteFlow.Api.Controllers.StockEntry
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class StockEntryController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public StockEntryController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-stock-entry")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateStockEntry([FromBody] CreateStockEntryRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateStockEntryCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-stock-entries-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetStockEntriesPaged([FromBody] GetStockEntriesPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetStockEntriesPagedQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-stock-entry-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetStockEntryById([FromBody] GetStockEntryByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetStockEntryByIdQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-stock-entry")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateStockEntry([FromBody] UpdateStockEntryRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateStockEntryCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-stock-entry")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteStockEntry([FromBody] SoftDeleteStockEntryRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteStockEntryCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-stock-value-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetStockValueByEnterpriseId()
        {
            try
            {
                var query = new GetStockValueByEnterpriseIdQuery();
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
