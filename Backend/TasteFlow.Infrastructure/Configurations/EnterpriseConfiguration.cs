using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Infrastructure.Configurations
{
    public class EnterpriseConfiguration : IEntityTypeConfiguration<Enterprise>
    {
        public void Configure(EntityTypeBuilder<Enterprise> builder)
        {
            builder.ToTable("Enterprise");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Id).IsRequired();
            builder.Property(e => e.FantasyName).HasMaxLength(512);
            builder.Property(e => e.SocialReason).HasMaxLength(512);
            builder.Property(e => e.Cnpj).HasMaxLength(512);
            builder.Property(e => e.LicenseQuantity);
            builder.Property(e => e.HasUnlimitedLicenses).IsRequired();
            builder.Property(e => e.IsHeadOffice).IsRequired();
            builder.Property(e => e.StateRegistration).HasMaxLength(512);
            builder.Property(e => e.MunicipalRegistration).HasMaxLength(512);
            builder.Property(e => e.Observation).HasMaxLength(2048);
            builder.Property(e => e.CreatedOn).IsRequired();
            builder.Property(e => e.ModifiedOn);
            builder.Property(e => e.DeletedOn);
            builder.Property(e => e.CreatedBy).IsRequired();
            builder.Property(e => e.ModifiedBy);
            builder.Property(e => e.DeletedBy);
            builder.Property(e => e.IsDeleted).IsRequired();
            builder.Property(e => e.IsActive).IsRequired();

            builder.HasMany(e => e.EnterpriseAddresses)
               .WithOne(ea => ea.Enterprise)
               .HasForeignKey(ea => ea.EnterpriseId)
               .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(e => e.EnterpriseContacts)
                .WithOne(ec => ec.Enterprise)
                .HasForeignKey(ec => ec.EnterpriseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(e => e.License)
                .WithMany()
                .HasForeignKey(e => e.LicenseId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
