using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.StockEntryAttachment.Queries;
using TasteFlow.Contracts.StockEntryAttachment.Request;

namespace TasteFlow.Api.Controllers.StockEntryAttachment
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class StockEntryAttachmentController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public StockEntryAttachmentController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("get-file-url-stock-entry-attachment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFileUrlStockEntryAttachment([FromBody] GetFileUrlStockEntryAttachmentRequest request)
        {
            try
            {
                var query = _mapper.Map<GetFileUrlStockEntryAttachmentQuery>(request);
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
