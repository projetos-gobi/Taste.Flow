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
    public class ProductCompositionConfiguration : IEntityTypeConfiguration<ProductComposition>
    {
        public void Configure(EntityTypeBuilder<ProductComposition> builder)
        {
            builder.ToTable("ProductComposition");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .IsRequired();

            builder.Property(p => p.EnterpriseId)
                .IsRequired();

            builder.Property(p => p.ProductId)
                .ValueGeneratedNever()
                .IsRequired();

            builder.Property(p => p.MerchandiseId)
                .IsRequired(false);

            builder.Property(p => p.ProductIntermediateId)
                .IsRequired(false);

            builder.Property(p => p.UnitId)
                .IsRequired();

            builder.Property(p => p.Quantity)
                .HasColumnType("decimal(18, 4)")
                .IsRequired();

            builder.Property(p => p.Yield)
                .HasColumnType("decimal(5, 2)")
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
                .HasConstraintName("FK_ProductComposition_Enterprise_EnterpriseId");

            builder.HasOne(p => p.Product)
                .WithMany(p => p.ProductCompositions)
                .HasForeignKey(p => p.ProductId)
                .HasConstraintName("FK_ProductComposition_Product_ProductId");

            builder.HasOne(p => p.Merchandise)
                .WithMany()
                .HasForeignKey(p => p.MerchandiseId)
                .HasConstraintName("FK_ProductComposition_Merchandise_MerchandiseId");

            builder.HasOne(p => p.ProductIntermediate)
                .WithMany()
                .HasForeignKey(p => p.ProductIntermediateId)
                .HasConstraintName("FK_ProductComposition_ProductIntermediate_ProductIntermediateId");

            builder.HasOne(p => p.Unit)
                .WithMany()
                .HasForeignKey(p => p.UnitId)
                .HasConstraintName("FK_ProductComposition_Unit_UnitId");
        }
    }
}
