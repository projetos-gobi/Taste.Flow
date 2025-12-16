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
    public class StockEntryItemConfiguration : IEntityTypeConfiguration<StockEntryItem>
    {
        public void Configure(EntityTypeBuilder<StockEntryItem> builder)
        {
            builder.ToTable("StockEntryItem");

            builder.HasKey(x => x.Id)
                   .HasName("PK_StockEntryItem");

            builder.Property(x => x.Id)
                   .IsRequired();

            builder.Property(x => x.EnterpriseId)
                   .IsRequired();

            builder.Property(x => x.StockEntryId)
                   .ValueGeneratedNever()
                   .IsRequired();

            builder.Property(x => x.MerchandiseId)
                   .IsRequired();

            builder.Property(x => x.CategoryId)
                   .IsRequired();

            builder.Property(x => x.UnitId)
                   .IsRequired();

            builder.Property(x => x.Quantity)
                   .HasColumnType("decimal(18,4)")
                   .IsRequired();

            builder.Property(x => x.TotalAmount)
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

            builder.Property(x => x.CreatedOn)
                   .IsRequired();

            builder.Property(x => x.ModifiedOn)
                   .HasDefaultValue(null);

            builder.Property(x => x.DeletedOn)
                   .HasDefaultValue(null);

            builder.Property(x => x.CreatedBy)
                   .IsRequired();

            builder.Property(x => x.ModifiedBy)
                   .HasDefaultValue(null);

            builder.Property(x => x.DeletedBy)
                   .HasDefaultValue(null);

            builder.Property(x => x.IsDeleted)
                   .IsRequired();

            builder.Property(x => x.IsActive)
                   .IsRequired();

            builder.HasOne(x => x.Enterprise)
                   .WithMany()
                   .HasForeignKey(x => x.EnterpriseId)
                   .HasConstraintName("FK_StockEntryItem_Enterprise_EnterpriseId");

            builder.HasOne(x => x.StockEntry)
                   .WithMany(x => x.StockEntryItems)
                   .HasForeignKey(x => x.StockEntryId)
                   .HasConstraintName("FK_StockEntryItem_StockEntry_StockEntryId");

            builder.HasOne(x => x.Merchandise)
                   .WithMany()
                   .HasForeignKey(x => x.MerchandiseId)
                   .HasConstraintName("FK_StockEntryItem_Merchandise_MerchandiseId");

            builder.HasOne(x => x.Category)
                   .WithMany()
                   .HasForeignKey(x => x.CategoryId)
                   .HasConstraintName("FK_StockEntryItem_Category_CategoryId");

            builder.HasOne(x => x.Unit)
                   .WithMany()
                   .HasForeignKey(x => x.UnitId)
                   .HasConstraintName("FK_StockEntryItem_Unit_UnitId");
        }
    }
}
