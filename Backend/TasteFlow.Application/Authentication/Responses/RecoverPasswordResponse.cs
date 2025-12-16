using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Authentication.Responses
{
    public record RecoverPasswordResponse
    {
        public bool Recovered { get; init; }
        public string Message { get; init; }

        public RecoverPasswordResponse(bool recovered, string message)
        {
            Recovered = recovered;
            Message = message;
        }

        public static RecoverPasswordResponse Empty(string message)
        {
            return new RecoverPasswordResponse(false, message);
        }
    }
}
