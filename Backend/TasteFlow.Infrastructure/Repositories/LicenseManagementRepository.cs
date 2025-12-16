using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Infrastructure.Repositories.Base;
using TasteFlow.Shared.Extensions;

namespace TasteFlow.Infrastructure.Repositories
{
    public class LicenseManagementRepository : BaseRepository<LicenseManagement>, ILicenseManagementRepository
    {
        private readonly IEventLogger _eventLogger;

        public LicenseManagementRepository(TasteFlowContext context, IEventLogger eventLogger) : base(context)
        {
            _eventLogger = eventLogger;
        }

        public async Task<IEnumerable<Guid>> CreateLicenseManagementsRangeForUsersAsync(Enterprise enterprise, int quantityLicenses)
        {
            try
            {
                int currentCount = enterprise.LicenseManagements?.Count(lm => !lm.IsDeleted) ?? 0;
                bool canAdd = enterprise.HasUnlimitedLicenses || currentCount + quantityLicenses <= enterprise.LicenseQuantity;

                if (!canAdd)
                {
                    return Enumerable.Empty<Guid>();
                }

                var newLicenseManagements = new List<LicenseManagement>();

                for (int i = 0; i < quantityLicenses; i++)
                {
                    var license = new LicenseManagement
                    {
                        Id = Guid.NewGuid(),
                        EnterpriseId = enterprise.Id,
                        LicenseId = enterprise.LicenseId,
                        LicenseCode = StringExtension.GenerateLicenseCode(10),
                        ExpirationDate = DateTime.UtcNow.AddYears(2),
                        IsIndefinite = false,
                        CreatedOn = DateTime.Now.ToUniversalTime(),
                        CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c"),
                        IsActive = true
                    };

                    newLicenseManagements.Add(license);
                }

                AddRange(newLicenseManagements);

                await SaveChangesAsync();

                return newLicenseManagements.Select(x => x.Id);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro as licenças para os usuários no sistema.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Guid>();
            }
        }
    }
}
