using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.Authentication.Commands;
using TasteFlow.Application.Authentication.Queries;
using TasteFlow.Contracts.Authentication.Request;
using TasteFlow.Contracts.Authentication.Response;

namespace TasteFlow.Api.Controllers.Authentication
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : BaseController
    {
        private readonly ISender _mediator;
        private readonly IMapper _mapper;

        public AuthenticationController(ISender mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                Console.WriteLine($"[DEBUG] Login request received - Email: {request?.Email}, Password: {(request?.Password != null ? "***" : "null")}");
                
                if (request == null)
                {
                    Console.WriteLine("[DEBUG] Request is null!");
                    return BadRequest("Request body is null");
                }
                
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest("Email and Password are required");
                }

                var query = _mapper.Map<AuthenticationQuery>(request);
                var result = await _mediator.Send(query);

                if (!String.IsNullOrEmpty(result.Token))
                {
                    var response = _mapper.Map<AuthenticationResponse>(result);
                    return Response(response);
                }
                else
                {
                    return Unauthorized();
                }
            }
            catch(Exception ex)
            {
                return StatusCode(500, "An error occurred during authentication");
            }
        }

        [HttpPost("forgotpassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                var command = _mapper.Map<ForgotPasswordCommand>(request);
                var result = await _mediator.Send(command);

                return Response(result);
            }
            catch
            {
                return Unauthorized();
            }
        }

        [HttpPost("validatepasswordrecoveryexpiration")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ValidatePasswordRecoveryExpiration([FromBody] ValidatePasswordRecoveryExpirationRequest request)
        {
            try
            {
                var query = _mapper.Map<ValidatePasswordResetTokenQuery>(request);
                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return Unauthorized();
            }
        }

        [Authorize]
        [HttpPost("recoverpassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RecoverPassword([FromBody] RecoverPasswordRequest request)
        {
            try
            {
                var query = _mapper.Map<RecoverPasswordCommand>(request);
                var result = await _mediator.Send(query);

                return Response(result);
            }
            catch
            {
                return Unauthorized();
            }
        }

        // REMOVIDO [Authorize] - refresh token não precisa de autenticação, ele valida o refresh token internamente
        [HttpPost("refresh-token")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var query = _mapper.Map<RefreshTokenQuery>(request);

                var result = await _mediator.Send(query);

                if (!String.IsNullOrEmpty(result.Token))
                {
                    return Response(result);
                }
                else
                {
                    return Unauthorized();
                }
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
