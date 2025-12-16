using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TasteFlow.Domain.Entities;
using TasteFlow.Infrastructure.Configurations;

namespace TasteFlow.Infrastructure;

public partial class TasteFlowContext : DbContext
{
    public TasteFlowContext()
    {
    }

    public TasteFlowContext(DbContextOptions<TasteFlowContext> options) : base(options)
    {
    }

    public virtual DbSet<Category> AccessProfiles { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<CategoryType> CategoryTypes { get; set; }

    public virtual DbSet<Email> Emails { get; set; }

    public virtual DbSet<EmailStatus> EmailStatuses { get; set; }

    public virtual DbSet<EmailTemplate> EmailTemplates { get; set; }

    public virtual DbSet<EmailTemplateType> EmailTemplateTypes { get; set; }

    public virtual DbSet<Enterprise> Enterprises { get; set; }

    public virtual DbSet<EnterpriseAddress> EnterpriseAddress { get; set; }

    public virtual DbSet<EnterpriseContact> EnterpriseContact { get; set; }

    public virtual DbSet<EnterpriseRelationship> EnterpriseRelationships { get; set; }

    public virtual DbSet<Item> Items { get; set; }

    public virtual DbSet<License> Licenses { get; set; }

    public virtual DbSet<LicenseManagement> LicenseManagements { get; set; }

    public virtual DbSet<Merchandise> Merchandises { get; set; }

    public virtual DbSet<PaymentType> PaymentTypes { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductComposition> ProductCompositions { get; set; }

    public virtual DbSet<ProductIntermediate> ProductIntermediates { get; set; }

    public virtual DbSet<ProductIntermediateComposition> ProductIntermediateCompositions { get; set; }

    public virtual DbSet<ProductType> ProductTypes { get; set; }

    public virtual DbSet<ProfileType> ProfileTypes { get; set; }

    public virtual DbSet<StockEntry> StockEntries { get; set; }

    public virtual DbSet<StockEntryItem> StockEntryItems { get; set; }

    public virtual DbSet<StockEntryAttachment> StockEntryAttachments { get; set; }

    public virtual DbSet<SubCategory> SubCategories { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<Unit> Units { get; set; }

    public virtual DbSet<Users> Users { get; set; }

    public virtual DbSet<UserEnterprise> UserEnterprises { get; set; }

    public virtual DbSet<UserRefreshToken> UserRefreshTokens { get; set; }

    public virtual DbSet<ProductCategoryType> ProductCategoryType { get; set; }

    public virtual DbSet<ProductAlternative> ProductAlternative { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        ApplyConfigurations(builder);

        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
            v => v.HasValue ? (v.Value.Kind == DateTimeKind.Utc ? v : v.Value.ToUniversalTime()) : v,
            v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v);

        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
                else if (property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(nullableDateTimeConverter);
                }
            }
        }

        foreach (var relationship in builder.Model.GetEntityTypes().SelectMany(x => x.GetForeignKeys()))
        {
            relationship.DeleteBehavior = DeleteBehavior.Restrict;
        }
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

    private static void ApplyConfigurations(ModelBuilder builder)
    {
        builder.ApplyConfiguration(new AccessProfileConfiguration());
        builder.ApplyConfiguration(new UsersConfiguration());
        builder.ApplyConfiguration(new EnterpriseConfiguration());
        builder.ApplyConfiguration(new EnterpriseAddressConfiguration());
        builder.ApplyConfiguration(new EnterpriseContactConfiguration());
        builder.ApplyConfiguration(new LicenseConfiguration());
        builder.ApplyConfiguration(new LicenseManagementConfiguration());
        builder.ApplyConfiguration(new UserEnterpriseConfiguration());
        builder.ApplyConfiguration(new UnitConfiguration());
        builder.ApplyConfiguration(new SubCategoryConfiguration());
        builder.ApplyConfiguration(new ItemConfiguration());
        builder.ApplyConfiguration(new ProductTypeConfiguration());
        builder.ApplyConfiguration(new CategoryTypeConfiguration());
        builder.ApplyConfiguration(new BrandConfiguration());
        builder.ApplyConfiguration(new CategoryConfiguration());
        builder.ApplyConfiguration(new PaymentTypeConfiguration());
        builder.ApplyConfiguration(new SupplierConfiguration());
        builder.ApplyConfiguration(new SupplierPaymentDetailConfiguration());
        builder.ApplyConfiguration(new SupplierPaymentTypeConfiguration());
        builder.ApplyConfiguration(new MerchandiseConfiguration());
        builder.ApplyConfiguration(new ProductIntermediateConfiguration());
        builder.ApplyConfiguration(new ProductIntermediateCompositionConfiguration());
        builder.ApplyConfiguration(new ProductConfiguration());
        builder.ApplyConfiguration(new ProductCompositionConfiguration());
        builder.ApplyConfiguration(new UserRefreshTokenConfiguration());
        builder.ApplyConfiguration(new EmailTemplateConfiguration());
        builder.ApplyConfiguration(new UserPasswordManagementConfiguration());
        builder.ApplyConfiguration(new StockEntryConfiguration());
        builder.ApplyConfiguration(new PaymentTermConfiguration());
        builder.ApplyConfiguration(new StockEntryItemConfiguration());
        builder.ApplyConfiguration(new StockEntryAttachmentConfiguration());
        builder.ApplyConfiguration(new ProductCategoryTypeConfiguration());
        builder.ApplyConfiguration(new ProductAlternativeConfiguration());
    }
}
