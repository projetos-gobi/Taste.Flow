using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TasteFlow.Application.Enterprise.Responses
{
    public record SoftDeleteEnterpriseResponse
    {
        public bool Deleted { get; set; }
        public string Message { get; set; }

        public SoftDeleteEnterpriseResponse(bool deleted, string message)
        {
            Deleted = deleted;
            Message = message;
        }

        public static SoftDeleteEnterpriseResponse Empty(string message)
        {
            return new SoftDeleteEnterpriseResponse(false, message);
        }
    }
}
