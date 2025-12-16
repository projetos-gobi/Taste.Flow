using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.Brand.Commands;
using TasteFlow.Application.Brand.Queries;
using TasteFlow.Contracts.Brand.Request;

namespace TasteFlow.Api.Controllers.Brand
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BrandController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public BrandController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-brands-range")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateBrandsRange([FromBody] CreateBrandsRangeRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateBrandsRangeCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-brands-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetBrandsPaged([FromBody] GetBrandsPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetBrandsPagedQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-brand-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetBrandById([FromBody] GetBrandByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetBrandByIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-brand")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateBrand([FromBody] UpdateBrandRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateBrandCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-brand")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteBrand([FromBody] SoftDeleteBrandRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteBrandCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-brands-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllBrandsByEnterpriseId([FromBody] GetAllBrandsByEnterpriseIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllBrandsByEnterpriseIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("check-brands-exist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckBrandsExist([FromBody] CheckBrandsExistRequest request)
        {
            try
            {
                var query = _mapper.Map<CheckBrandsExistQuery>(request);
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
