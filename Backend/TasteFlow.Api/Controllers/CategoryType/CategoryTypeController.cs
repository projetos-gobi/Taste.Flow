using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.CategoryType.Commands;
using TasteFlow.Application.CategoryType.Queries;
using TasteFlow.Contracts.CategoryType.Request;

namespace TasteFlow.Api.Controllers.CategoryType
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryTypeController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public CategoryTypeController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-category-types-range")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateCategoryTypesRange([FromBody] CreateCategoryTypesRangeRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateCategoryTypesRangeCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-category-types-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCategoryTypesPaged([FromBody] GetCategoryTypesPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetCategoryTypesPagedQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-category-type-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCategoryTypeById([FromBody] GetCategoryTypeByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetCategoryTypeByIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-category-type")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateCategoryType([FromBody] UpdateCategoryTypeRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateCategoryTypeCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-category-type")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteCategoryType([FromBody] SoftDeleteCategoryTypeRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteCategoryTypeCommand>(request);
                command.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-category-types-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllCategoryTypesByEnterpriseId([FromBody] GetAllCategoryTypesByEnterpriseIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllCategoryTypesByEnterpriseIdQuery>(request);
                query.EnterpriseId = EnterpriseId.Value;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("check-category-types-exist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckCategoryTypesExist([FromBody] CheckCategoryTypesExistRequest request)
        {
            try
            {
                var query = _mapper.Map<CheckCategoryTypesExistQuery>(request);
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
