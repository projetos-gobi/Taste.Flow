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
    public class LicenseConfiguration : IEntityTypeConfiguration<License>
    {
        public void Configure(EntityTypeBuilder<License> builder)
        {
            builder.ToTable("License");

            builder.HasKey(l => l.Id);

            builder.Property(l => l.Id)
                .IsRequired();

            builder.Property(l => l.Name)
                .HasMaxLength(512)
                .IsRequired();

            builder.Property(l => l.Description)
                .HasMaxLength(512)
                .IsRequired();

            builder.Property(l => l.Value)
                .HasColumnType("decimal(18,2)")
                .IsRequired(false);

            builder.Property(l => l.Order)
                .IsRequired(false);

            builder.Property(l => l.CreatedOn)
                .IsRequired();

            builder.Property(l => l.ModifiedOn)
                .IsRequired(false);

            builder.Property(l => l.DeletedOn)
                .IsRequired(false);

            builder.Property(l => l.CreatedBy)
                .IsRequired();

            builder.Property(l => l.ModifiedBy)
                .IsRequired(false);

            builder.Property(l => l.DeletedBy)
                .IsRequired(false);

            builder.Property(l => l.IsDeleted)
                .IsRequired();

            builder.Property(l => l.IsActive)
                .IsRequired();
        }
    }
}
