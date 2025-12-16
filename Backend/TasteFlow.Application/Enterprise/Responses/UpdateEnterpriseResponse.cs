using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Enterprise.Responses
{
    public record UpdateEnterpriseResponse
    {
        public bool Updated { get; set; }
        public string Message { get; set; }

        public UpdateEnterpriseResponse(bool updated, string message)
        {
            Updated = updated;
            Message = message;
        }

        public static UpdateEnterpriseResponse Empty(string message)
        {
            return new UpdateEnterpriseResponse(false, message);
        }
    }
}
