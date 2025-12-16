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
    public class UnitConfiguration : IEntityTypeConfiguration<Unit>
    {
        public void Configure(EntityTypeBuilder<Unit> builder)
        {
            builder.ToTable("Unit");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Id)
                .IsRequired();

            builder.Property(u => u.EnterpriseId)
                .IsRequired();

            builder.Property(u => u.Name)
                .IsRequired()
                .HasMaxLength(512);

            builder.Property(u => u.Value)
                .HasColumnType("decimal(18,4)");

            builder.Property(u => u.CreatedOn)
                .IsRequired();

            builder.Property(u => u.ModifiedOn)
                .IsRequired(false);

            builder.Property(u => u.DeletedOn)
                .IsRequired(false);

            builder.Property(u => u.CreatedBy)
                .IsRequired();

            builder.Property(u => u.ModifiedBy)
                .IsRequired(false);

            builder.Property(u => u.DeletedBy)
                .IsRequired(false);

            builder.Property(u => u.IsDeleted)
                .IsRequired();

            builder.Property(u => u.IsActive)
                .IsRequired();

            builder.HasOne(u => u.Enterprise)
                .WithMany()
                .HasForeignKey(u => u.EnterpriseId)
                .HasConstraintName("FK_Unit_Enterprise_EnterpriseId");
        }
    }
}
