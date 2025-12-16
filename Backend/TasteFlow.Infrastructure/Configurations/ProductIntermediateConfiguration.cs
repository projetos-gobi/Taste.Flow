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
    public class ProductIntermediateConfiguration : IEntityTypeConfiguration<ProductIntermediate>
    {
        public void Configure(EntityTypeBuilder<ProductIntermediate> builder)
        {
            builder.ToTable("ProductIntermediate");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .IsRequired();

            builder.Property(p => p.EnterpriseId)
                .IsRequired();

            builder.Property(p => p.CategoryId)
                .IsRequired(false);

            builder.Property(p => p.SubCategoryId)
                .IsRequired(false);

            builder.Property(p => p.UnitId)
                .IsRequired(false);

            builder.Property(p => p.Name)
                .HasMaxLength(512)
                .IsRequired();

            builder.Property(p => p.Description)
                .HasMaxLength(2048)
                .IsRequired();

            builder.Property(p => p.Instruction)
                .IsRequired();

            builder.Property(p => p.Price)
                .HasColumnType("decimal(18, 2)")
                .IsRequired(false);

            builder.Property(p => p.Yield)
                .HasColumnType("decimal(5, 3)")
                .IsRequired();

            builder.Property(p => p.PreparationTime)
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
                .HasConstraintName("FK_ProductIntermediate_Enterprise_EnterpriseId");

            builder.HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .HasConstraintName("FK_ProductIntermediate_Category_CategoryId");

            builder.HasOne(p => p.SubCategory)
                .WithMany()
                .HasForeignKey(p => p.SubCategoryId)
                .HasConstraintName("FK_ProductIntermediate_SubCategory_SubCategoryId");

            builder.HasOne(p => p.Unit)
                .WithMany()
                .HasForeignKey(p => p.UnitId)
                .HasConstraintName("FK_ProductIntermediate_Unit_UnitId");
        }
    }
}
