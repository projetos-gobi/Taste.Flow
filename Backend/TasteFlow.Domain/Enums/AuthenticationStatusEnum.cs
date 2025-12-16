using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Enums.Base;

namespace TasteFlow.Domain.Enums
{
    public sealed class AuthenticationStatusEnum : SmartEnum<AuthenticationStatusEnum>
    {
        public static readonly AuthenticationStatusEnum Success = new AuthenticationStatusEnum(new Guid("11111111-1111-1111-1111-111111111111"), nameof(Success));
        public static readonly AuthenticationStatusEnum InvalidCredentials = new AuthenticationStatusEnum(new Guid("22222222-2222-2222-2222-222222222222"), nameof(InvalidCredentials));
        public static readonly AuthenticationStatusEnum UserNotFound = new AuthenticationStatusEnum(new Guid("33333333-3333-3333-3333-333333333333"), nameof(UserNotFound));
        public static readonly AuthenticationStatusEnum Error = new AuthenticationStatusEnum(new Guid("44444444-4444-4444-4444-444444444444"), nameof(Error));

        public AuthenticationStatusEnum(Guid id, string name) : base(id, name)
        {
        }
    }
}
