using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces.Services;

namespace TasteFlow.Infrastructure.Authentication
{
    public class TokenGenerator : ITokenGenerator
    {
        private readonly IDateTimeProvider _dateTimeProvider;
        private readonly TokenSettings _tokenSettings;

        public TokenGenerator(IDateTimeProvider dateTimeProvider, IOptions<TokenSettings> tokenOptions)
        {
            _tokenSettings = tokenOptions.Value;
            _dateTimeProvider = dateTimeProvider;
        }

        public string GenerateToken(Users user)
        {
            try
            {
                var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenSettings.Secret)), SecurityAlgorithms.HmacSha256);

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.AccessProfileId.ToString()),
                    new Claim("userid", user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iss, _tokenSettings.Issuer),
                    new Claim("profileId", user.AccessProfileId.ToString()),
                    new Claim("enterpriseId", user.UserEnterprises?.FirstOrDefault()?.EnterpriseId.ToString() ?? ""),
                    new Claim(JwtRegisteredClaimNames.Name, user.Name),
                    new Claim(JwtRegisteredClaimNames.Email, user.EmailAddress),
                    new Claim("mustchangepassword", user.MustChangePassword.ToString()),
                    new Claim( "changepasswordcode", user.UserPasswordManagements .OrderByDescending(x => x.CreatedOn) .FirstOrDefault()?.Code ?? string.Empty)
                };

                var securityToken = new JwtSecurityToken(
                    issuer: _tokenSettings.Issuer,
                    audience: _tokenSettings.Audience,
                    expires: _dateTimeProvider.UtcNow.AddMinutes(_tokenSettings.ExpiryMinutes),
                    claims: claims,
                    signingCredentials: signingCredentials
                );

                return new JwtSecurityTokenHandler().WriteToken(securityToken);
            }
            catch
            {
                return String.Empty;
            }
        }
    }
}
