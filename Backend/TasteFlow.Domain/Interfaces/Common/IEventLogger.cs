using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Enums;

namespace TasteFlow.Domain.Interfaces.Common
{
    public interface IEventLogger
    {
        Guid Log(LogTypeEnum logType, Exception exception, string message);
        Guid Log(LogTypeEnum logType, string message);
    }
}
