using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Enums.Base;

namespace TasteFlow.Domain.Enums
{
    public sealed class AccessProfileEnum : SmartEnum<AccessProfileEnum>
    {
        public static readonly AccessProfileEnum administrator = new AccessProfileEnum(new Guid("109ae3c4-17fd-4cf3-a0e2-e781fe457dcf"), nameof(administrator));
        public static readonly AccessProfileEnum User = new AccessProfileEnum(new Guid("b7c9b9d4-4c1f-4f01-a3b3-5ae71f66dabc"), nameof(User));

        public AccessProfileEnum(Guid id, string name) : base(id, name)
        {
        }
    }
}
