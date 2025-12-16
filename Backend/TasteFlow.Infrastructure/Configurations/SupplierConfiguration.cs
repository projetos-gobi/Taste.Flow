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
    public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
    {
        public void Configure(EntityTypeBuilder<Supplier> builder)
        {
            builder.ToTable("Supplier");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Id)
                .IsRequired();

            builder.Property(s => s.EnterpriseId)
                .IsRequired();

            builder.Property(s => s.CategoryId)
                .IsRequired();

            builder.Property(s => s.SubCategoryId)
                .IsRequired();

            builder.Property(s => s.FantasyName)
                .HasMaxLength(512);

            builder.Property(s => s.SocialReason)
                .HasMaxLength(512);

            builder.Property(s => s.Cnpj)
                .HasMaxLength(512);

            builder.Property(s => s.Telephone)
                .HasMaxLength(512);

            builder.Property(s => s.Address)
                .HasMaxLength(512);

            builder.Property(s => s.Latitude)
                .HasColumnType("float");

            builder.Property(s => s.Longitude)
                .HasColumnType("float");

            builder.Property(s => s.CreatedOn)
                .IsRequired();

            builder.Property(s => s.ModifiedOn)
                .HasDefaultValue(null);

            builder.Property(s => s.DeletedOn)
                .HasDefaultValue(null);

            builder.Property(s => s.CreatedBy)
                .IsRequired();

            builder.Property(s => s.ModifiedBy)
                .HasDefaultValue(null);

            builder.Property(s => s.DeletedBy)
                .HasDefaultValue(null);

            builder.Property(s => s.IsDeleted)
                .IsRequired();

            builder.Property(s => s.IsActive)
                .IsRequired();

            builder.HasOne(s => s.Enterprise)
                .WithMany()
                .HasForeignKey(s => s.EnterpriseId)
                .HasConstraintName("FK_Supplier_Enterprise_EnterpriseId");

            builder.HasOne(s => s.Category)
                .WithMany() 
                .HasForeignKey(s => s.CategoryId)
                .HasConstraintName("FK_Supplier_Category_CategoryId");

            builder.HasOne(s => s.SubCategory)
                .WithMany() 
                .HasForeignKey(s => s.SubCategoryId)
                .HasConstraintName("FK_Supplier_SubCategory_SubCategoryId");

            builder.HasMany(s => s.SupplierPaymentTypes)
                .WithOne(spt => spt.Supplier)
                .HasForeignKey(spt => spt.SupplierId)
                .HasConstraintName("FK_SupplierPaymentType_Supplier_SupplierId");
        }
    }
}
