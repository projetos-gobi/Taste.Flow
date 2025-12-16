using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Enterprise.Responses
{
    public record CreateEnterpriseResponse
    {
        public bool Created { get; set; }
        public string Message { get; set; }

        public CreateEnterpriseResponse(bool created, string message)
        {
            Created = created;
            Message = message;
        }

        public static CreateEnterpriseResponse Empty(string message) 
        { 
            return new CreateEnterpriseResponse(false, message);
        }
    }
}
