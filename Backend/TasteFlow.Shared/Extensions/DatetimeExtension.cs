using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Shared.Extensions
{
    public static class DatetimeExtension
    {
        public static DateTime GetLocalTime()
        {
            TimeZoneInfo timeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
            DateTime time = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);
            return time;
        }
    }
}
