using Amazon.Runtime;
using Amazon;
using Amazon.S3;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System;
using System.Text;
using TasteFlow.Domain.Interfaces;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces.Services;
using TasteFlow.Infrastructure.Authentication;
// using TasteFlow.Infrastructure.Log;
using TasteFlow.Infrastructure.Repositories;
using TasteFlow.Infrastructure.Repositories.Base;
using TasteFlow.Infrastructure.Services;
using TasteFlow.Infrastructure.Settings;

namespace TasteFlow.Infrastructure.Startup
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, ConfigurationManager configuration)
        {
            services.AddAuth(configuration);

            // NpgsqlDataSource singleton: um pool único e eficiente para ADO.NET (reutilizado por repositórios e warmup).
            services.AddSingleton<NpgsqlDataSource>(_ =>
            {
                var raw = configuration.GetConnectionString("DefaultConnection");
                var normalized = NpgsqlConnectionStringNormalizer.Normalize(raw);

                if (string.IsNullOrWhiteSpace(normalized))
                    throw new InvalidOperationException("Connection string DefaultConnection não configurada.");

                // Forçar defaults de performance/estabilidade caso não venham do env/appsettings
                var csb = new NpgsqlConnectionStringBuilder(normalized)
                {
                    Pooling = true,
                    MinPoolSize = 1,
                    MaxPoolSize = 20,
                    Timeout = 5,
                    CommandTimeout = 15,
                    KeepAlive = 30
                };

                return new NpgsqlDataSourceBuilder(csb.ConnectionString).Build();
            });

            services.AddDbContext<TasteFlowContext>(options => 
            {
                var normalizedConnectionString = NpgsqlConnectionStringNormalizer.Normalize(
                    configuration.GetConnectionString("DefaultConnection"));

                options.UseNpgsql(
                    normalizedConnectionString,
                    npgsqlOptions => 
                    {
                        npgsqlOptions.CommandTimeout(30); // 30 segundos timeout
                        npgsqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 3,
                            maxRetryDelay: TimeSpan.FromSeconds(5),
                            errorCodesToAdd: null);
                    });
                
                // OTIMIZAÇÕES para PostgreSQL
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking); // Não rastrear por padrão
                options.EnableSensitiveDataLogging(false); // Desabilitar logs sensíveis
                options.EnableServiceProviderCaching(); // Cache do service provider
                options.EnableDetailedErrors(false); // Desabilitar erros detalhados em produção
            });

            services.InjectionDependency(configuration);

            return services;
        }

        public static void InjectionDependency(this IServiceCollection services, IConfiguration configuration)
        {
            //Common 
            services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
            services.AddSingleton<ITokenGenerator, TokenGenerator>();

            services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
            services.AddScoped<IEventLogger, TasteFlow.Infrastructure.Services.DummyEventLogger>();

            //AWS - Temporariamente desabilitado (adicionar credenciais quando necessário)
            // var awsSettings = new AwsSettings();
            // configuration.GetSection(AwsSettings.SectionName).Bind(awsSettings);

            // var credentials = new BasicAWSCredentials(awsSettings.AccessKey, awsSettings.SecretKey);
            // var awsOptions = new Amazon.Extensions.NETCore.Setup.AWSOptions
            // {
            //     Credentials = credentials,
            //     Region = RegionEndpoint.GetBySystemName(awsSettings.Region)
            // };

            // services.AddDefaultAWSOptions(awsOptions);
            // services.AddAWSService<IAmazonS3>();

            //Repositories
            services.AddScoped<IAccessProfileRepository, AccessProfileRepository>();
            services.AddScoped<IBrandRepository, BrandRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ICategoryTypeRepository, CategoryTypeRepository>();
            services.AddScoped<IEmailRepository, EmailRepository>();
            services.AddScoped<IEmailStatusRepository, EmailStatusRepository>();
            services.AddScoped<IEmailTemplateRepository, EmailTemplateRepository>();
            services.AddScoped<IEmailTemplateTypeRepository, EmailTemplateTypeRepository>();
            services.AddScoped<IEnterpriseRepository, EnterpriseRepository>();
            services.AddScoped<IEnterpriseRelationshipRepository, EnterpriseRelationshipRepository>();
            services.AddScoped<IItemRepository, ItemRepository>();
            services.AddScoped<ILicenseRepository, LicenseRepository>();
            services.AddScoped<ILicenseManagementRepository, LicenseManagementRepository>();
            services.AddScoped<IMerchandiseRepository, MerchandiseRepository>();
            services.AddScoped<IPaymentTypeRepository, PaymentTypeRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductCompositionRepository, ProductCompositionRepository>();
            services.AddScoped<IProductIntermediateRepository, ProductIntermediateRepository>();
            services.AddScoped<IProductIntermediateCompositionRepository, ProductIntermediateCompositionRepository>();
            services.AddScoped<IProductTypeRepository, ProductTypeRepository>();
            services.AddScoped<IProfileTypeRepository, ProfileTypeRepository>();
            services.AddScoped<IStockEntryRepository, StockEntryRepository>();
            services.AddScoped<IStockEntryItemRepository, StockEntryItemRepository>();
            services.AddScoped<ISubCategoryRepository, SubCategoryRepository>();
            services.AddScoped<ISupplierRepository, SupplierRepository>();
            services.AddScoped<IUnitRepository, UnitRepository>();
            services.AddScoped<IUserEnterpriseRepository, UserEnterpriseRepository>();
            services.AddScoped<IUserRefreshTokenRepository, UserRefreshTokenRepository>();
            services.AddScoped<IUsersRepository, UsersRepository>();
            services.AddScoped<IUserPasswordManagementRepository, UserPasswordManagementRepository>();
            services.AddScoped<IPaymentTermRepository, PaymentTermRepository>();
            services.AddScoped<IStockEntryAttachmentRepository, StockEntryAttachmentRepository>();

            //Service external
            services.AddScoped<IMailSendService, MailSendService>();
            services.AddScoped<IFileStorageService, S3FileStorageService>();
        }

        public static IServiceCollection AddAuth(this IServiceCollection services, ConfigurationManager configuration)
        {
            var tokenSettings = new TokenSettings();
            var mailSendSettings = new MailSendSettings();

            configuration.Bind(TokenSettings.SectionName, tokenSettings);
            configuration.Bind(MailSendSettings.SectionName, mailSendSettings);

            services.AddSingleton(Options.Create(tokenSettings));
            services.AddSingleton(Options.Create(mailSendSettings));

            services.AddAuthentication(defaultScheme: JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = tokenSettings.Issuer,
                ValidAudience = tokenSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenSettings.Secret))
            });

            return services;
        }
    }
}
