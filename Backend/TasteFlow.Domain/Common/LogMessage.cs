using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Enums;

namespace TasteFlow.Domain.Common
{
    public class LogMessage
    {
        public Guid Id { get; }
        [System.Text.Json.Serialization.JsonConverter(typeof(StringEnumConverter))]
        public LogTypeEnum LogType { get; }
        public DateTime DateTime { get; }
        public string Message { get; }
        public string Project { get; }
        public string App { get; }

        public LogMessage(string message, LogTypeEnum logType)
        {
            Id = Guid.NewGuid();
            DateTime = DateTime.Now;
            Message = message;
            LogType = logType;
        }

        public LogMessage(Guid token, string message, LogTypeEnum logType)
        {
            Id = token;
            DateTime = DateTime.Now;
            Message = message;
            LogType = logType;
        }

        public string Serialize()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
