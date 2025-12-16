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
    public class LicenseManagementConfiguration : IEntityTypeConfiguration<LicenseManagement>
    {
        public void Configure(EntityTypeBuilder<LicenseManagement> builder)
        {
            builder.ToTable("LicenseManagement");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .IsRequired();

            builder.Property(x => x.LicenseId)
                .IsRequired(false);

            builder.Property(x => x.EnterpriseId)
                .IsRequired(false);

            builder.Property(x => x.LicenseCode)
                .IsRequired(false);

            builder.Property(x => x.ExpirationDate)
                .IsRequired();

            builder.Property(x => x.IsIndefinite)
                .IsRequired();

            builder.Property(x => x.CreatedOn)
                .IsRequired();

            builder.Property(x => x.ModifiedOn)
                .IsRequired(false);

            builder.Property(x => x.DeletedOn)
                .IsRequired(false);

            builder.Property(x => x.CreatedBy)
                .IsRequired();

            builder.Property(x => x.ModifiedBy)
                .IsRequired(false);

            builder.Property(x => x.DeletedBy)
                .IsRequired(false);

            builder.Property(x => x.IsDeleted)
                .IsRequired();

            builder.Property(x => x.IsActive)
                .IsRequired();

            builder.HasOne(x => x.License)
                .WithMany()
                .HasForeignKey(x => x.LicenseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Enterprise)
                .WithMany(x => x.LicenseManagements)
                .HasForeignKey(x => x.EnterpriseId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
