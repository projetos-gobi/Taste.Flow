using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.ValueObjects;
using TasteFlow.Infrastructure.Repositories.Base;
using TasteFlow.Infrastructure.Services;

namespace TasteFlow.Infrastructure.Repositories
{
    public class EnterpriseRepository : BaseRepository<Enterprise>, IEnterpriseRepository
    {
        private readonly TasteFlowContext _context;
        private readonly NpgsqlDataSource _dataSource;

        public EnterpriseRepository(TasteFlowContext context, NpgsqlDataSource dataSource) : base(context)
        {
            _context = context;
            _dataSource = dataSource;
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
            var enterprises = new List<Enterprise>();

            try
            {
                var swRepo = Stopwatch.StartNew();
                var swOpen = Stopwatch.StartNew();
                await using (var connection = await _dataSource.OpenConnectionAsync())
                {
                    swOpen.Stop();
                    Activity.Current?.SetTag("tf_ent_dbopen", swOpen.Elapsed.TotalMilliseconds);

                    // Query SQL otimizada (JOIN + GROUP BY), evitando subquery por empresa
                    var sql = @"
                        SELECT 
                            e.""Id"", 
                            e.""LicenseId"", 
                            e.""FantasyName"", 
                            e.""SocialReason"", 
                            e.""Cnpj"", 
                            e.""LicenseQuantity"", 
                            e.""HasUnlimitedLicenses"",
                            COALESCE(
                                COUNT(ue.""Id"") FILTER (
                                    WHERE COALESCE(ue.""IsActive"", true)
                                      AND NOT COALESCE(ue.""IsDeleted"", false)
                                      AND ue.""LicenseManagementId"" IS NOT NULL
                                ), 0
                            ) AS ""UsedLicenses""
                        FROM ""Enterprise"" e
                        LEFT JOIN ""UserEnterprise"" ue
                          ON ue.""EnterpriseId"" = e.""Id""
                        WHERE COALESCE(e.""IsActive"", true)
                          AND NOT COALESCE(e.""IsDeleted"", false)
                        GROUP BY 
                            e.""Id"", e.""LicenseId"", e.""FantasyName"", e.""SocialReason"", e.""Cnpj"",
                            e.""LicenseQuantity"", e.""HasUnlimitedLicenses""";

                    var command = new NpgsqlCommand(sql, connection);
                    command.CommandTimeout = 15;

                    var swQuery = Stopwatch.StartNew();
                    await using (var reader = await command.ExecuteReaderAsync())
                    {
                        var ordId = reader.GetOrdinal("Id");
                        var ordLicenseId = reader.GetOrdinal("LicenseId");
                        var ordFantasyName = reader.GetOrdinal("FantasyName");
                        var ordSocialReason = reader.GetOrdinal("SocialReason");
                        var ordCnpj = reader.GetOrdinal("Cnpj");
                        var ordLicenseQuantity = reader.GetOrdinal("LicenseQuantity");
                        var ordHasUnlimitedLicenses = reader.GetOrdinal("HasUnlimitedLicenses");
                        var ordUsedLicenses = reader.GetOrdinal("UsedLicenses");

                        while (await reader.ReadAsync())
                        {
                            var licenseQuantity = reader.IsDBNull(ordLicenseQuantity) 
                                ? (int?)null 
                                : reader.GetInt32(ordLicenseQuantity);
                            var hasUnlimitedLicenses = !reader.IsDBNull(ordHasUnlimitedLicenses) && reader.GetBoolean(ordHasUnlimitedLicenses);
                            var usedLicenses = reader.IsDBNull(ordUsedLicenses) ? 0 : reader.GetInt32(ordUsedLicenses);

                            enterprises.Add(new Enterprise
                            {
                                Id = reader.GetGuid(ordId),
                                LicenseId = reader.IsDBNull(ordLicenseId) 
                                    ? (Guid?)null 
                                    : reader.GetGuid(ordLicenseId),
                                FantasyName = reader.IsDBNull(ordFantasyName) ? string.Empty : reader.GetString(ordFantasyName),
                                SocialReason = reader.IsDBNull(ordSocialReason) 
                                    ? null 
                                    : reader.GetString(ordSocialReason),
                                Cnpj = reader.IsDBNull(ordCnpj) 
                                    ? null 
                                    : reader.GetString(ordCnpj),
                                LicenseQuantity = hasUnlimitedLicenses ? 1000 : (licenseQuantity ?? 0) - usedLicenses,
                                HasUnlimitedLicenses = hasUnlimitedLicenses,
                                UserEnterprises = new List<UserEnterprise>() // Lista vazia - não precisa para o response
                            });
                        }
                    }

                    swQuery.Stop();
                    Activity.Current?.SetTag("tf_ent_dbquery", swQuery.Elapsed.TotalMilliseconds);
                    swRepo.Stop();
                    Activity.Current?.SetTag("tf_ent_repo_total", swRepo.Elapsed.TotalMilliseconds);
                }
            }
            catch (Exception ex)
            {
                return Enumerable.Empty<Enterprise>();
            }

            return enterprises;
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

        public async Task<(List<Enterprise> enterprises, int totalCount)> GetEnterprisesPagedWithCountDirectAsync(int page, int pageSize, object filter = null)
        {
            // Objetivo: evitar EF/Include/CountAsync em Postgres + pooler (instabilidade/latência).
            // Implementação via ADO.NET direto com paginação, filtros simples e um COUNT barato.
            var enterprises = new List<Enterprise>();
            var totalCount = 0;

            // Extrair filtros por reflexão (mantém compatibilidade com Application.Common.Filters.EnterpriseFilter).
            Guid? licenseId = null;
            string fantasyName = null;
            string cnpj = null;
            string city = null;
            bool? isActive = null;

            if (filter != null)
            {
                var t = filter.GetType();
                licenseId = t.GetProperty("LicenseId")?.GetValue(filter) as Guid?;
                fantasyName = t.GetProperty("FantasyName")?.GetValue(filter) as string;
                cnpj = t.GetProperty("Cnpj")?.GetValue(filter) as string;
                city = t.GetProperty("City")?.GetValue(filter) as string;
                isActive = t.GetProperty("IsActive")?.GetValue(filter) as bool?;
            }

            var offset = Math.Max(0, (page - 1) * pageSize);

            const int maxRetries = 2;
            var retryCount = 0;
            var delayMs = 100;

            while (retryCount < maxRetries)
            {
                try
                {
                    enterprises.Clear();
                    var swRepo = Stopwatch.StartNew();

                    var swOpen = Stopwatch.StartNew();
                    await using var connection = await _dataSource.OpenConnectionAsync();
                    swOpen.Stop();
                    Activity.Current?.SetTag("tf_ent_paged_dbopen", swOpen.Elapsed.TotalMilliseconds);

                    // WHERE dinâmico (somente filtros informados)
                    var where = new StringBuilder();
                    where.AppendLine(@"WHERE NOT COALESCE(e.""IsDeleted"", false)");

                    if (isActive.HasValue)
                        where.AppendLine(@"  AND COALESCE(e.""IsActive"", true) = @isActive");

                    if (licenseId.HasValue)
                        where.AppendLine(@"  AND e.""LicenseId"" = @licenseId");

                    if (!string.IsNullOrWhiteSpace(fantasyName))
                        where.AppendLine(@"  AND LOWER(COALESCE(e.""FantasyName"", '')) LIKE @fantasyName");

                    if (!string.IsNullOrWhiteSpace(cnpj))
                        where.AppendLine(@"  AND e.""Cnpj"" = @cnpj");

                    if (!string.IsNullOrWhiteSpace(city))
                        where.AppendLine(@"
  AND EXISTS (
    SELECT 1
    FROM ""EnterpriseAddress"" ea
    WHERE ea.""EnterpriseId"" = e.""Id""
      AND NOT COALESCE(ea.""IsDeleted"", false)
      AND LOWER(COALESCE(ea.""City"", '')) LIKE @city
  )");

                    var countSql = $@"
SELECT COUNT(*)
FROM ""Enterprise"" e
{where}";

                    await using (var countCmd = new NpgsqlCommand(countSql, connection) { CommandTimeout = 10 })
                    {
                        BindParams(countCmd);
                        var swCount = Stopwatch.StartNew();
                        var scalar = await countCmd.ExecuteScalarAsync();
                        swCount.Stop();
                        Activity.Current?.SetTag("tf_ent_paged_dbcount", swCount.Elapsed.TotalMilliseconds);
                        totalCount = scalar == null ? 0 : Convert.ToInt32(scalar);
                    }

                    // SELECT: pegar campos + 1º contato + 1º endereço + nome da licença (LEFT JOIN)
                    var selectSql = $@"
SELECT
  e.""Id"",
  e.""LicenseId"",
  e.""FantasyName"",
  e.""Cnpj"",
  e.""LicenseQuantity"",
  COALESCE(e.""IsActive"", true) AS ""IsActive"",
  l.""Name"" AS ""LicenseName"",
  (
    SELECT ec.""EmailAddress""
    FROM ""EnterpriseContact"" ec
    WHERE ec.""EnterpriseId"" = e.""Id""
      AND NOT COALESCE(ec.""IsDeleted"", false)
    ORDER BY ec.""CreatedOn"" ASC
    LIMIT 1
  ) AS ""EmailAddress"",
  (
    SELECT ec.""Telephone""
    FROM ""EnterpriseContact"" ec
    WHERE ec.""EnterpriseId"" = e.""Id""
      AND NOT COALESCE(ec.""IsDeleted"", false)
    ORDER BY ec.""CreatedOn"" ASC
    LIMIT 1
  ) AS ""Contact"",
  (
    SELECT (COALESCE(ea.""Street"", '') || ' - ' || COALESCE(ea.""PostalCode"", ''))
    FROM ""EnterpriseAddress"" ea
    WHERE ea.""EnterpriseId"" = e.""Id""
      AND NOT COALESCE(ea.""IsDeleted"", false)
    ORDER BY ea.""CreatedOn"" ASC
    LIMIT 1
  ) AS ""Address""
FROM ""Enterprise"" e
LEFT JOIN ""License"" l ON l.""Id"" = e.""LicenseId""
{where}
ORDER BY e.""CreatedOn"" ASC
LIMIT @pageSize OFFSET @offset";

                    await using (var cmd = new NpgsqlCommand(selectSql, connection) { CommandTimeout = 15 })
                    {
                        BindParams(cmd);
                        cmd.Parameters.AddWithValue("pageSize", pageSize);
                        cmd.Parameters.AddWithValue("offset", offset);

                        var swQuery = Stopwatch.StartNew();
                        await using var reader = await cmd.ExecuteReaderAsync();
                        swQuery.Stop();
                        Activity.Current?.SetTag("tf_ent_paged_dbquery", swQuery.Elapsed.TotalMilliseconds);

                        while (await reader.ReadAsync())
                        {
                            var ent = new Enterprise
                            {
                                Id = reader.GetGuid(0),
                                LicenseId = reader.IsDBNull(1) ? (Guid?)null : reader.GetGuid(1),
                                FantasyName = reader.IsDBNull(2) ? null : reader.GetString(2),
                                Cnpj = reader.IsDBNull(3) ? null : reader.GetString(3),
                                LicenseQuantity = reader.IsDBNull(4) ? 0 : reader.GetInt32(4),
                                IsActive = !reader.IsDBNull(5) && reader.GetBoolean(5),
                                IsDeleted = false,
                                License = reader.IsDBNull(6) ? null : new License { Name = reader.GetString(6) },
                                EnterpriseContacts = new List<EnterpriseContact>(),
                                EnterpriseAddresses = new List<EnterpriseAddress>(),
                            };

                            if (!reader.IsDBNull(7))
                                ent.EnterpriseContacts.Add(new EnterpriseContact { EmailAddress = reader.GetString(7) });

                            if (!reader.IsDBNull(8))
                                ent.EnterpriseContacts.Add(new EnterpriseContact { Telephone = reader.GetString(8) });

                            if (!reader.IsDBNull(9))
                                ent.EnterpriseAddresses.Add(new EnterpriseAddress { Street = reader.GetString(9) });

                            enterprises.Add(ent);
                        }
                    }

                    swRepo.Stop();
                    Activity.Current?.SetTag("tf_ent_paged_repo_total", swRepo.Elapsed.TotalMilliseconds);
                    return (enterprises, totalCount);
                }
                catch (Exception ex)
                {
                    retryCount++;
                    if (retryCount >= maxRetries)
                        return (enterprises, totalCount);

                    await Task.Delay(delayMs);
                    delayMs *= 2;
                }
            }

            return (enterprises, totalCount);

            void BindParams(NpgsqlCommand c)
            {
                if (isActive.HasValue) c.Parameters.AddWithValue("isActive", isActive.Value);
                if (licenseId.HasValue) c.Parameters.AddWithValue("licenseId", licenseId.Value);
                if (!string.IsNullOrWhiteSpace(fantasyName))
                    c.Parameters.AddWithValue("fantasyName", $"%{fantasyName.Trim().ToLowerInvariant()}%");
                if (!string.IsNullOrWhiteSpace(cnpj))
                    c.Parameters.AddWithValue("cnpj", cnpj.Trim());
                if (!string.IsNullOrWhiteSpace(city))
                    c.Parameters.AddWithValue("city", $"%{city.Trim().ToLowerInvariant()}%");
            }
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
