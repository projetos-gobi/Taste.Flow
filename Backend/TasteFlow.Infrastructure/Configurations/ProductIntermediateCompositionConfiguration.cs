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
    public class ProductIntermediateCompositionConfiguration : IEntityTypeConfiguration<ProductIntermediateComposition>
    {
        public void Configure(EntityTypeBuilder<ProductIntermediateComposition> builder)
        {
            builder.ToTable("ProductIntermediateComposition");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .IsRequired();

            builder.Property(p => p.EnterpriseId)
                .IsRequired();

            builder.Property(p => p.ProductIntermediateId)
                .ValueGeneratedNever()
                .IsRequired();

            builder.Property(p => p.MerchandiseId)
                .IsRequired(false);

            builder.Property(p => p.UnitId)
                .IsRequired();

            builder.Property(p => p.Quantity)
                .HasColumnType("decimal(18,4)")
                .IsRequired();

            builder.Property(p => p.Yield)
                .HasColumnType("decimal(5,2)")
                .IsRequired();

            builder.Property(p => p.CreatedOn)
                .IsRequired();

            builder.Property(p => p.ModifiedOn)
                .IsRequired(false);

            builder.Property(p => p.DeletedOn)
                .IsRequired(false);

            builder.Property(p => p.CreatedBy)
                .IsRequired();

            builder.Property(p => p.ModifiedBy)
                .IsRequired(false);

            builder.Property(p => p.DeletedBy)
                .IsRequired(false);

            builder.Property(p => p.IsDeleted)
                .IsRequired();

            builder.Property(p => p.IsActive)
                .IsRequired();

            builder.HasOne(p => p.Enterprise)
                .WithMany()
                .HasForeignKey(p => p.EnterpriseId)
                .HasConstraintName("FK_ProductIntermediateComposition_Enterprise_EnterpriseId");

            builder.HasOne(p => p.ProductIntermediate)
                .WithMany(p => p.ProductIntermediateCompositions)
                .HasForeignKey(p => p.ProductIntermediateId)
                .HasConstraintName("FK_ProductIntermediateComposition_ProductIntermediate_ProductIntermediateId");

            builder.HasOne(p => p.Merchandise)
                .WithMany()
                .HasForeignKey(p => p.MerchandiseId)
                .HasConstraintName("FK_ProductIntermediateComposition_Merchandise_MerchandiseId");

            builder.HasOne(p => p.Unit)
                .WithMany()
                .HasForeignKey(p => p.UnitId)
                .HasConstraintName("FK_ProductIntermediateComposition_Unit_UnitId");
        }
    }
}
