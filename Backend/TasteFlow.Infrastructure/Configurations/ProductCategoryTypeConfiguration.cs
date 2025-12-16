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
    public class ProductCategoryTypeConfiguration : IEntityTypeConfiguration<ProductCategoryType>
    {
        public void Configure(EntityTypeBuilder<ProductCategoryType> builder)
        {
            builder.ToTable("ProductCategoryType");

            builder.HasKey(pct => pct.Id)
                   .HasName("PK_ProductCategoryType");

            builder.Property(pct => pct.Id)
                   .IsRequired();

            builder.Property(pct => pct.Name)
                   .HasMaxLength(512)
                   .IsRequired();

            builder.Property(pct => pct.CreatedOn)
                   .IsRequired();

            builder.Property(pct => pct.ModifiedOn);

            builder.Property(pct => pct.DeletedOn);

            builder.Property(pct => pct.CreatedBy)
                   .IsRequired();

            builder.Property(pct => pct.ModifiedBy);

            builder.Property(pct => pct.DeletedBy);

            builder.Property(pct => pct.IsDeleted)
                   .IsRequired();

            builder.Property(pct => pct.IsActive)
                   .IsRequired();
        }
    }
}
