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
    public class ProductAlternativeConfiguration : IEntityTypeConfiguration<ProductAlternative>
    {
        public void Configure(EntityTypeBuilder<ProductAlternative> builder)
        {
            builder.ToTable("ProductAlternative");

            builder.HasKey(pa => pa.Id)
                   .HasName("PK_ProductAlternative");

            builder.Property(pa => pa.Id).IsRequired();
            builder.Property(pa => pa.EnterpriseId).IsRequired();
            builder.Property(pa => pa.ProductOriginalId).IsRequired();
            builder.Property(pa => pa.ProductSecondaryId).IsRequired();
            builder.Property(pa => pa.CostReduction);
            builder.Property(pa => pa.MarginImprovement);
            builder.Property(pa => pa.CreatedOn).IsRequired();
            builder.Property(pa => pa.ModifiedOn);
            builder.Property(pa => pa.DeletedOn);
            builder.Property(pa => pa.CreatedBy).IsRequired();
            builder.Property(pa => pa.ModifiedBy);
            builder.Property(pa => pa.DeletedBy);
            builder.Property(pa => pa.IsDeleted).IsRequired();
            builder.Property(pa => pa.IsActive).IsRequired();

            builder.HasOne(pa => pa.ProductOriginal)
                   .WithMany()
                   .HasForeignKey(pa => pa.ProductOriginalId)
                   .HasConstraintName("FK_ProductAlternative_Product_ProductOriginalId");

            builder.HasOne(pa => pa.ProductSecondary)
                   .WithMany()
                   .HasForeignKey(pa => pa.ProductSecondaryId)
                   .HasConstraintName("FK_ProductAlternative_Product_ProductSecondaryId");

            builder.HasOne(pa => pa.Enterprise)
                   .WithMany()
                   .HasForeignKey(pa => pa.EnterpriseId)
                   .HasConstraintName("FK_ProductAlternative_Enterprise_EnterpriseId");

        }
    }
}
