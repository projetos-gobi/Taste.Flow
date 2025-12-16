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
    public class AccessProfileConfiguration : IEntityTypeConfiguration<AccessProfile>
    {
        public void Configure(EntityTypeBuilder<AccessProfile> builder)
        {
            builder.ToTable("AccessProfile");

            builder.HasKey(ap => ap.Id).HasName("PK_AccessProfile");

            builder.Property(ap => ap.Id)
                .IsRequired()
                .HasColumnName("Id");

            builder.Property(ap => ap.Name)
                .IsRequired()
                .HasMaxLength(512)
                .HasColumnName("Name");

            builder.Property(ap => ap.CreatedOn)
                .IsRequired()
                .HasColumnName("CreatedOn");

            builder.Property(ap => ap.ModifiedOn)
                .HasColumnName("ModifiedOn")
                .IsRequired(false);

            builder.Property(ap => ap.DeletedOn)
                .HasColumnName("DeletedOn")
                .IsRequired(false);

            builder.Property(ap => ap.CreatedBy)
                .IsRequired()
                .HasColumnName("CreatedBy");

            builder.Property(ap => ap.ModifiedBy)
                .HasColumnName("ModifiedBy")
                .IsRequired(false);

            builder.Property(ap => ap.DeletedBy)
                .HasColumnName("DeletedBy")
                .IsRequired(false);

            builder.Property(ap => ap.IsDeleted)
                .IsRequired()
                .HasColumnName("IsDeleted");

            builder.Property(ap => ap.IsActive)
                .IsRequired()
                .HasColumnName("IsActive");
        }
    }
}
