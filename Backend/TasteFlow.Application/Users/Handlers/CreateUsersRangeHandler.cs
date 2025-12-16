using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Users.Commands;
using TasteFlow.Application.Users.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Shared.Extensions;

namespace TasteFlow.Application.Users.Handlers
{
    public class CreateUsersRangeHandler : IRequestHandler<CreateUsersRangeCommand, CreateUsersRangeResponse>
    {
        private readonly IUsersRepository _usersRepository;
        private readonly ILicenseManagementRepository _licenseManagementRepository;
        private readonly IUserEnterpriseRepository _userEnterpriseRepository;
        private readonly IEnterpriseRepository _enterpriseRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public CreateUsersRangeHandler(IUsersRepository usersRepository, ILicenseManagementRepository licenseManagementRepository, IUserEnterpriseRepository userEnterpriseRepository, IEnterpriseRepository enterpriseRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _usersRepository = usersRepository;
            _licenseManagementRepository = licenseManagementRepository;
            _userEnterpriseRepository = userEnterpriseRepository;
            _enterpriseRepository = enterpriseRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<CreateUsersRangeResponse> Handle(CreateUsersRangeCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var users = _mapper.Map<IEnumerable<Domain.Entities.Users>>(request.Users);

                var duplicatedEmails = request.Users.GroupBy(u => u.EmailAddress.ToLower().Trim()).Where(g => g.Count() > 1).Select(g => g.Key).ToList();

                if (duplicatedEmails.Any())
                {
                    return CreateUsersRangeResponse.Empty($"Os seguintes e-mails estão duplicados: {string.Join(", ", duplicatedEmails)}");
                }

                users.ToList().ForEach(x =>
                {
                    x.PasswordHash = StringExtension.GenerateRandomPassword(12);
                });

                var result = await _usersRepository.CreateUsersRangeAsync(users);

                if (request.EnterpriseId.HasValue)
                {
                    var enterprise = await _enterpriseRepository.GetEnterpriseByIdForCreateLicenseAsync(request.EnterpriseId.Value);

                    if (enterprise != null) 
                    { 
                        var licenseIds = await _licenseManagementRepository.CreateLicenseManagementsRangeForUsersAsync(enterprise, request.Users.Count());

                        if (licenseIds.Any())
                        {
                            await _userEnterpriseRepository.CreateUserEnterpriseForUsersAsync(result, licenseIds, request.EnterpriseId.Value);
                        }
                    }
                }

                return new CreateUsersRangeResponse((result.Count() > 0), ((result.Count() > 0) ? "Usuários criados com sucesso." : "Não foi possível criar os usuários no sistema."));
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo de criação de usuários.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return CreateUsersRangeResponse.Empty("Ocorreu um erro durante o processo de criação de usuários.");
            }
        }
    }
}
