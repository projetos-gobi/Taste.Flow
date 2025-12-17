using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using TasteFlow.Api.Controllers.Base;
using TasteFlow.Application.Authentication.Commands;
using TasteFlow.Application.Authentication.Queries;
using TasteFlow.Contracts.Authentication.Request;
using TasteFlow.Contracts.Authentication.Response;
using TasteFlow.Domain.Enums;

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
                if (request == null)
                {
                    return BadRequest("Request body is null");
                }
                
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest("Email and Password are required");
                }

                var swMapper = Stopwatch.StartNew();
                var query = _mapper.Map<AuthenticationQuery>(request);
                swMapper.Stop();
                Activity.Current?.SetTag("tf_auth_map", swMapper.Elapsed.TotalMilliseconds);

                var swMediator = Stopwatch.StartNew();
                var result = await _mediator.Send(query);
                swMediator.Stop();
                Activity.Current?.SetTag("tf_auth_mediator", swMediator.Elapsed.TotalMilliseconds);

                if (!String.IsNullOrEmpty(result.Token))
                {
                    var swRespMap = Stopwatch.StartNew();
                    var response = _mapper.Map<AuthenticationResponse>(result);
                    swRespMap.Stop();
                    Activity.Current?.SetTag("tf_auth_respmap", swRespMap.Elapsed.TotalMilliseconds);
                    return Response(response);
                }
                else
                {
                    // NÃO retornar 401 quando for erro interno/infra (ex.: banco instável).
                    if (result.AuthenticationStatus == AuthenticationStatusEnum.Error.Name)
                        return StatusCode(StatusCodes.Status503ServiceUnavailable, "Serviço temporariamente indisponível. Tente novamente.");

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
