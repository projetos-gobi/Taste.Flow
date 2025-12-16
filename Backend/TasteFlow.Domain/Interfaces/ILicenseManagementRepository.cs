using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Domain.Interfaces
{
    public interface ILicenseManagementRepository : IRepository<LicenseManagement>
    {
        Task<IEnumerable<Guid>> CreateLicenseManagementsRangeForUsersAsync(Enterprise enterprise, int quantityLicenses);
    }
}
