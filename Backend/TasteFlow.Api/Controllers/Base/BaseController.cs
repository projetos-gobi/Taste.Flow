using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using TasteFlow.Contracts.Common;

namespace TasteFlow.Api.Controllers.Base
{
    public class BaseController : ControllerBase
    {
        protected Guid? EnterpriseId
        {
            get
            {
                var enterpriseIdClaim = User.FindFirst("enterpriseId")?.Value;
                if (Guid.TryParse(enterpriseIdClaim, out var id))
                    return id;

                return null;
            }
        }

        protected new IActionResult Response(object? resultData = null, List<ValidationResult> validations = null)
        {
            if (validations == null || validations != null && validations.Count == 0)
            {
                return Ok(
                    new ResponseMessage<object>
                    {
                        Success = true,
                        Data = resultData
                    });
            }
            else
            {
                return Ok(
                    new ResponseMessage<object>
                    {
                        Success = false,
                        Errors = validations.Select(x => x.ErrorMessage),
                        Data = resultData
                    });
            }
        }
    }
}
