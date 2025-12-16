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
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Product");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .IsRequired();

            builder.Property(p => p.EnterpriseId)
                .IsRequired();

            builder.Property(p => p.ProductCategoryTypeId);

            builder.Property(p => p.CategoryId)
                .IsRequired();

            builder.Property(p => p.SubCategoryId)
                .IsRequired();

            builder.Property(p => p.Name)
                .HasMaxLength(512)
                .IsRequired();

            builder.Property(p => p.Instruction)
                .IsRequired(false);

            builder.Property(p => p.Price)
                .HasColumnType("decimal(18, 2)")
                .IsRequired(false);

            builder.Property(p => p.Yield)
                .IsRequired();

            builder.Property(p => p.Multiplier)
                .HasColumnType("decimal(18, 4)")
                .IsRequired();

            builder.Property(p => p.MarginValue)
                .HasColumnType("decimal(18, 4)");

            builder.Property(p => p.MarginPercent)
                .HasColumnType("decimal(5, 2)");

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
                .HasConstraintName("FK_Product_Enterprise_EnterpriseId");

            builder.HasOne(p => p.ProductCategoryType)
                .WithMany()
                .HasForeignKey(p => p.ProductCategoryTypeId)
                .HasConstraintName("FK_Product_ProductCategoryType_ProductCategoryTypeId");

            builder.HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .HasConstraintName("FK_Product_Category_CategoryId");

            builder.HasOne(p => p.SubCategory)
                .WithMany()
                .HasForeignKey(p => p.SubCategoryId)
                .HasConstraintName("FK_Product_SubCategory_SubCategoryId");
        }
    }
}
