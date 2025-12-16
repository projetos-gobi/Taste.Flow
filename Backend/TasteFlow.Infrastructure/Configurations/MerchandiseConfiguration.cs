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
    public class MerchandiseConfiguration : IEntityTypeConfiguration<Merchandise>
    {
        public void Configure(EntityTypeBuilder<Merchandise> builder)
        {
            builder.ToTable("Merchandise");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.Id)
                .IsRequired();

            builder.Property(m => m.EnterpriseId)
                .IsRequired();

            builder.Property(m => m.ItemId)
                .IsRequired();

            builder.Property(m => m.BrandId)
                .IsRequired(false);

            builder.Property(m => m.ProductTypeId)
                .IsRequired(false);

            builder.Property(m => m.CategoryId)
                .IsRequired();

            builder.Property(m => m.UnitId)
                .IsRequired();

            builder.Property(m => m.CreatedOn)
                .IsRequired();

            builder.Property(m => m.ModifiedOn)
                .IsRequired(false);

            builder.Property(m => m.DeletedOn)
                .IsRequired(false);

            builder.Property(m => m.CreatedBy)
                .IsRequired();

            builder.Property(m => m.ModifiedBy)
                .IsRequired(false);

            builder.Property(m => m.DeletedBy)
                .IsRequired(false);

            builder.Property(m => m.IsDeleted)
                .IsRequired();

            builder.Property(m => m.IsActive)
                .IsRequired();

            builder.HasOne(m => m.Enterprise)
                .WithMany()
                .HasForeignKey(m => m.EnterpriseId)
                .HasConstraintName("FK_Merchandise_Enterprise_EnterpriseId");

            builder.HasOne(m => m.Item)
                .WithMany()
                .HasForeignKey(m => m.ItemId)
                .HasConstraintName("FK_Merchandise_Item_ItemId");

            builder.HasOne(m => m.Brand)
                .WithMany()
                .HasForeignKey(m => m.BrandId)
                .HasConstraintName("FK_Merchandise_Brand_BrandId");

            builder.HasOne(m => m.ProductType)
                .WithMany()
                .HasForeignKey(m => m.ProductTypeId)
                .HasConstraintName("FK_Merchandise_ProductType_ProductTypeId");

            builder.HasOne(m => m.Category)
                .WithMany()
                .HasForeignKey(m => m.CategoryId)
                .HasConstraintName("FK_Merchandise_Category_CategoryId");

            builder.HasOne(m => m.Unit)
                .WithMany()
                .HasForeignKey(m => m.UnitId)
                .HasConstraintName("FK_Merchandise_Unit_CategoryId");
        }
    }
}
