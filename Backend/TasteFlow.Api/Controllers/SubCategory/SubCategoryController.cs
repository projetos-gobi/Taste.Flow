using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.SubCategory.Commands;
using TasteFlow.Application.SubCategory.Queries;
using TasteFlow.Contracts.SubCategory.Request;

namespace TasteFlow.Api.Controllers.SubCategory
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SubCategoryController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public SubCategoryController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("create-sub-categories-range")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateSubCategoriesRange([FromBody] CreateSubCategoriesRangeRequest request)
        {
            try
            {
                var command = _mapper.Map<CreateSubCategoriesRangeCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-sub-categories-paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetSubCategoriesPaged([FromBody] GetSubCategoriesPagedRequest request)
        {
            try
            {
                var query = _mapper.Map<GetSubCategoriesPagedQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-sub-category-by-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetSubCategoryById([FromBody] GetSubCategoryByIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetSubCategoryByIdQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("update-sub-category")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateSubCategory([FromBody] UpdateSubCategoryRequest request)
        {
            try
            {
                var command = _mapper.Map<UpdateSubCategoryCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("soft-delete-sub-category")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SoftDeleteSubCategory([FromBody] SoftDeleteSubCategoryRequest request)
        {
            try
            {
                var command = _mapper.Map<SoftDeleteSubCategoryCommand>(request);
                command.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("get-all-sub-categories-by-enterprise-id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllSubCategoriesByEnterpriseId([FromBody] GetAllSubCategoriesByEnterpriseIdRequest request)
        {
            try
            {
                var query = _mapper.Map<GetAllSubCategoriesByEnterpriseIdQuery>(request);
                query.EnterpriseId = EnterpriseIdValue;

                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("check-sub-categories-exist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckSubCategoriesExist([FromBody] CheckSubCategoriesExistRequest request)
        {
            try
            {
                var query = _mapper.Map<CheckSubCategoriesExistQuery>(request);
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
