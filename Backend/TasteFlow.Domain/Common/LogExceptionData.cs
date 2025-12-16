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
    public class LogExceptionData
    {
        public Guid Id { get; }
        [System.Text.Json.Serialization.JsonConverter(typeof(StringEnumConverter))]
        public LogTypeEnum LogType { get; }
        public DateTime DateTime { get; }
        public ExceptionData Data { get; }
        public string Message { get; }

        public LogExceptionData(Exception exception, LogTypeEnum logType)
        {
            Id = Guid.NewGuid();
            DateTime = DateTime.Now;
            LogType = logType;

            Data = ExtractInformation(exception);
        }

        public LogExceptionData(string message, Exception exception, LogTypeEnum logType)
        {
            Id = Guid.NewGuid();
            DateTime = DateTime.Now;
            LogType = logType;
            Message = message;
            Data = ExtractInformation(exception);
        }

        public LogExceptionData(Guid token, Exception exception, LogTypeEnum logType)
        {
            Id = token;
            DateTime = DateTime.Now;
            LogType = logType;

            Data = ExtractInformation(exception);
        }

        public LogExceptionData(Guid token, string message, Exception exception, LogTypeEnum logType)
        {
            Id = token;
            DateTime = DateTime.Now;
            LogType = logType;
            Message = message;

            Data = ExtractInformation(exception);
        }

        private ExceptionData ExtractInformation(Exception exception)
        {
            var data = new ExceptionData
            {
                Message = exception.Message,
                Source = exception.Source,
                StackTrace = exception.StackTrace
            };

            if (exception.InnerException != null)
            {
                data.InnerExceptionData = ExtractInformation(exception.InnerException);
            }

            return data;
        }

        public string Serialize()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
