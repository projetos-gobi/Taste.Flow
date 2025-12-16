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
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("Category");

            builder.HasKey(sc => sc.Id)
                   .HasName("PK_Category");

            builder.Property(sc => sc.Id)
                   .IsRequired();

            builder.Property(sc => sc.EnterpriseId)
                   .IsRequired();

            builder.Property(sc => sc.CategoryTypeId)
                   .IsRequired();

            builder.Property(sc => sc.Name)
                   .HasMaxLength(512)
                   .IsRequired();

            builder.Property(sc => sc.CreatedOn)
                   .IsRequired();

            builder.Property(sc => sc.ModifiedOn);

            builder.Property(sc => sc.DeletedOn);

            builder.Property(sc => sc.CreatedBy)
                   .IsRequired();

            builder.Property(sc => sc.ModifiedBy);

            builder.Property(sc => sc.DeletedBy);

            builder.Property(sc => sc.IsDeleted)
                   .IsRequired();

            builder.Property(sc => sc.IsActive)
                   .IsRequired();

            builder.HasOne(sc => sc.Enterprise)
                   .WithMany()
                   .HasForeignKey(sc => sc.EnterpriseId)
                   .HasConstraintName("FK_Category_Enterprise_EnterpriseId");

            builder.HasOne(sc => sc.CategoryType)
                   .WithMany()
                   .HasForeignKey(sc => sc.CategoryTypeId)
                   .HasConstraintName("FK_Category_CategoryType_CategoryTypeId");
        }
    }
}
