using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.ValueObjects;
using TasteFlow.Infrastructure.Repositories.Base;

namespace TasteFlow.Infrastructure.Repositories
{
    public class EnterpriseRepository : BaseRepository<Enterprise>, IEnterpriseRepository
    {
        public EnterpriseRepository(TasteFlowContext context) : base(context)
        {
        }

        public async Task<bool> CreateEnterpriseAsync(Enterprise enterprise)
        {
            try
            {
                enterprise.IsHeadOffice = true;
                enterprise.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                enterprise.CreatedOn = DateTime.Now.ToUniversalTime();
                enterprise.IsDeleted = false;

                enterprise.EnterpriseAddresses.ToList().ForEach(x =>
                {
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                enterprise.EnterpriseContacts.ToList().ForEach(x =>
                {
                    x.CreatedOn = DateTime.Now.ToUniversalTime();
                    x.CreatedBy = Guid.Parse("8f6a55e6-a763-4f13-9b58-9cea44e1836c");
                });

                Add(enterprise);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao criar uma empresa: {enterprise.Cnpj}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<IEnumerable<Enterprise>> GetAllEnterprisesForUserRegistrationAsync()
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.IsActive && !x.IsDeleted)
                    .Select(x => new Enterprise()
                    {
                        Id = x.Id,
                        LicenseId = x.LicenseId,
                        FantasyName = x.FantasyName,
                        SocialReason = x.SocialReason,
                        Cnpj = x.Cnpj,
                        LicenseQuantity = x.LicenseQuantity,
                        HasUnlimitedLicenses = x.HasUnlimitedLicenses,
                        LicenseManagements = x.LicenseManagements.Where(lm => lm.IsActive && !lm.IsDeleted)
                        .Select(lm => new LicenseManagement
                        {
                            Id = lm.Id,
                            LicenseId = lm.LicenseId,
                            EnterpriseId = lm.EnterpriseId,
                            LicenseCode = lm.LicenseCode,
                            IsDeleted = lm.IsDeleted,
                            IsActive = lm.IsActive
                        }).ToList(),
                        UserEnterprises = x.UserEnterprises.Where(ue => ue.IsActive && !ue.IsDeleted).ToList()
                    }).AsNoTracking().ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao buscar empresas para cadastro de usuários.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return Enumerable.Empty<Enterprise>();
            }
        }

        public async Task<Enterprise> GetEnterpriseByIdAsync(Guid id)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && !x.IsDeleted)
                    .Select(x => new Enterprise()
                    {
                        Id = x.Id,
                        LicenseId = x.LicenseId,
                        FantasyName = x.FantasyName,
                        SocialReason = x.SocialReason,
                        Cnpj = x.Cnpj,
                        LicenseQuantity = x.LicenseQuantity,
                        MunicipalRegistration = x.MunicipalRegistration,
                        StateRegistration = x.StateRegistration,
                        Observation = x.Observation,
                        IsActive = x.IsActive,
                        CreatedOn = x.CreatedOn,
                        IsDeleted = x.IsDeleted,
                        License = x.License != null ? new License()
                        {
                            Id = x.License.Id,
                            Name = x.License.Name
                        } : null,
                        EnterpriseAddresses = x.EnterpriseAddresses.Select(ea => new EnterpriseAddress()
                        {
                            Id = ea.Id,
                            PostalCode = ea.PostalCode,
                            Street = ea.Street,
                            City = ea.City,
                            Complement = ea.Complement,
                            Number = ea.Number,
                            District = ea.District,
                            State = ea.State
                        }).ToList(),
                        EnterpriseContacts = x.EnterpriseContacts.Select(ec => new EnterpriseContact()
                        {
                            Id = ec.Id,
                            EmailAddress = ec.EmailAddress,
                            Responsible = ec.Responsible,
                            Telephone = ec.Telephone 
                        }).ToList()
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de uma empresa pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);
                return null;
            }
        }

        public async Task<Enterprise> GetEnterpriseByIdForCreateLicenseAsync(Guid id)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && x.IsActive && !x.IsDeleted)
                    .Select(x => new Enterprise()
                    {
                        Id = x.Id,
                        LicenseId = x.LicenseId,
                        LicenseQuantity = x.LicenseQuantity,
                        HasUnlimitedLicenses = x.HasUnlimitedLicenses,
                        LicenseManagements = x.LicenseManagements.Where(lm => lm.IsActive && !lm.IsDeleted)
                        .Select(lm => new LicenseManagement
                        {
                            Id = lm.Id,
                            LicenseId = lm.LicenseId,
                            EnterpriseId = lm.EnterpriseId,
                            IsDeleted = lm.IsDeleted,
                            IsActive = lm.IsActive
                        }).ToList()
                    }).AsNoTracking().FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao busca uma empresa para cadastro de licença de usuário.";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<Enterprise> GetEnterpriseDetailByIdAsync(Guid id)
        {
            try
            {
                var result = await DbSet
                    .Where(x => x.Id == id && !x.IsDeleted)
                    .Select(x => new Enterprise()
                    {
                        Id = x.Id,
                        FantasyName = x.FantasyName,
                        SocialReason = x.SocialReason,
                        Cnpj = x.Cnpj,
                        MunicipalRegistration = x.MunicipalRegistration,
                        StateRegistration = x.StateRegistration,
                    }).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de detalhes uma empresa pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public async Task<bool> GetEnterpriseExistingAsync(Enterprise enterprise)
        {
            try
            {
                var result = await DbSet.AnyAsync(x => (x.Cnpj.Equals(enterprise.Cnpj) || x.MunicipalRegistration.Equals(enterprise.MunicipalRegistration) || x.StateRegistration.Equals(enterprise.StateRegistration)) && !x.IsDeleted);

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante a busca de uma empresa, CNPJ: {enterprise.Cnpj}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }

        }

        public async Task<Enterprise> GetEnterpriseForUpdateByIdAsync(Guid id)
        {
            try
            {
                var result = await DbSet
                    .Include(x => x.EnterpriseAddresses)
                    .Include(x => x.EnterpriseContacts)
                    .Where(x => x.Id == id && !x.IsDeleted)
                    .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo buscar de uma empresa pelo ID: {id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return null;
            }
        }

        public IQueryable<Enterprise> GetEnterprisesPaged()
        {
            var result = GetAllNoTracking()
                .Where(x => x.IsActive && !x.IsDeleted)
                .Select(x => new Enterprise()
                {
                    Id = x.Id,
                    LicenseId = x.LicenseId,
                    FantasyName = x.FantasyName,
                    Cnpj = x.Cnpj,
                    LicenseQuantity = x.LicenseQuantity,
                    IsActive = x.IsActive,
                    CreatedOn = x.CreatedOn,
                    IsDeleted = x.IsDeleted,
                    License = x.License != null ? new License()
                    {
                        Id = x.License.Id,
                        Name = x.License.Name
                    } : null,
                    EnterpriseAddresses = x.EnterpriseAddresses.Select(ea => new EnterpriseAddress()
                    {
                        Id = ea.Id,
                        PostalCode = ea.PostalCode,
                        Street = ea.Street
                    }).ToList(),
                    EnterpriseContacts = x.EnterpriseContacts.Select(ec => new EnterpriseContact()
                    {
                        Id = ec.Id,
                        EmailAddress = ec.EmailAddress
                    }).ToList()
                });

            return result;
        }

        public async Task<bool> SoftDeleteEnterpriseAsync(Guid enterpriseId, Guid userId)
        {
            try
            {
                var enterprise = await GetEnterpriseForUpdateByIdAsync(enterpriseId);

                if (enterprise == null)
                    return false;

                enterprise.IsDeleted = true;
                enterprise.IsActive = false;
                enterprise.DeletedOn = DateTime.UtcNow;
                //enterprise.DeletedBy = userId;

                foreach (var address in enterprise.EnterpriseAddresses)
                {
                    address.IsDeleted = true;
                    address.IsActive = false;
                    address.DeletedOn = DateTime.UtcNow;
                    //address.DeletedBy = userId;
                }

                foreach (var contact in enterprise.EnterpriseContacts)
                {
                    contact.IsDeleted = true;
                    contact.IsActive = false;
                    contact.DeletedOn = DateTime.UtcNow;
                    //contact.DeletedBy = userId;
                }

                Update(enterprise);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao deletar uma empresa: {enterpriseId}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }

        public async Task<bool> UpdateEnterpriseAsync(Enterprise enterprise)
        {
            try
            {
                var currentEnterprise = await GetEnterpriseForUpdateByIdAsync(enterprise.Id);

                if (currentEnterprise == null)
                    return false;

                currentEnterprise.LicenseId = enterprise.LicenseId;
                currentEnterprise.MainEnterpriseId = enterprise.MainEnterpriseId;
                currentEnterprise.FantasyName = enterprise.FantasyName;
                currentEnterprise.SocialReason = enterprise.SocialReason;
                currentEnterprise.Cnpj = enterprise.Cnpj;
                currentEnterprise.LicenseQuantity = enterprise.LicenseQuantity;
                currentEnterprise.IsHeadOffice = enterprise.IsHeadOffice;
                currentEnterprise.StateRegistration = enterprise.StateRegistration;
                currentEnterprise.MunicipalRegistration = enterprise.MunicipalRegistration;
                currentEnterprise.Observation = enterprise.Observation;
                currentEnterprise.ModifiedOn = DateTime.Now.ToUniversalTime();
                currentEnterprise.IsActive = enterprise.IsActive;

                foreach (var address in enterprise.EnterpriseAddresses)
                {
                    var existing = currentEnterprise.EnterpriseAddresses.FirstOrDefault(a => a.Id == address.Id);

                    if (existing != null)
                    {
                        existing.PostalCode = address.PostalCode;
                        existing.Street = address.Street;
                        existing.Number = address.Number;
                        existing.Complement = address.Complement;
                        existing.District = address.District;
                        existing.City = address.City;
                        existing.State = address.State;
                        existing.ModifiedOn = DateTime.Now.ToUniversalTime();
                    }
                }

                foreach (var contact in enterprise.EnterpriseContacts)
                {
                    var existing = currentEnterprise.EnterpriseContacts.FirstOrDefault(a => a.Id == contact.Id);

                    if (existing != null)
                    {
                        existing.Responsible = contact.Responsible;
                        existing.Telephone = contact.Telephone;
                        existing.EmailAddress = contact.EmailAddress;
                        existing.ModifiedOn = DateTime.Now.ToUniversalTime();
                    }
                }

                Update(currentEnterprise);

                var result = await SaveChangesAsync();

                return (result > 0);
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro ao atualizar uma empresa: {enterprise.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return false;
            }
        }
    }
}
