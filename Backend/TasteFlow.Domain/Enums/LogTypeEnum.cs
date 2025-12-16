using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Enums.Base;

namespace TasteFlow.Domain.Enums
{
    public sealed class LogTypeEnum : SmartEnum<LogTypeEnum>
    {
        public static readonly LogTypeEnum Debug = new LogTypeEnum(new Guid("11111111-1111-1111-1111-111111111111"), nameof(Debug));
        public static readonly LogTypeEnum Error = new LogTypeEnum(new Guid("22222222-2222-2222-2222-222222222222"), nameof(Error));
        public static readonly LogTypeEnum Fatal = new LogTypeEnum(new Guid("33333333-3333-3333-3333-333333333333"), nameof(Fatal));
        public static readonly LogTypeEnum Information = new LogTypeEnum(new Guid("44444444-4444-4444-4444-444444444444"), nameof(Information));
        public static readonly LogTypeEnum Warning = new LogTypeEnum(new Guid("55555555-5555-5555-5555-555555555555"), nameof(Warning));

        public LogTypeEnum(Guid id, string name) : base(id, name)
        {
        }
    }
}
