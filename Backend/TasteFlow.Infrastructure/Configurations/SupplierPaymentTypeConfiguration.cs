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
    public class SupplierPaymentTypeConfiguration : IEntityTypeConfiguration<SupplierPaymentType>
    {
        public void Configure(EntityTypeBuilder<SupplierPaymentType> builder)
        {
            builder.ToTable("SupplierPaymentType");

            builder.HasKey(spt => spt.Id)
                .HasName("PK_SupplierPaymentType");

            builder.Property(spt => spt.Id).IsRequired();

            builder.Property(spt => spt.EnterpriseId).IsRequired();

            builder.Property(spt => spt.SupplierId)
                .ValueGeneratedNever()
                .IsRequired();

            builder.Property(spt => spt.PaymentTypeId).IsRequired();

            builder.Property(spt => spt.CreatedOn).IsRequired();

            builder.Property(spt => spt.ModifiedOn).IsRequired(false);

            builder.Property(spt => spt.DeletedOn).IsRequired(false);

            builder.Property(spt => spt.CreatedBy).IsRequired();

            builder.Property(spt => spt.ModifiedBy).IsRequired(false);

            builder.Property(spt => spt.DeletedBy).IsRequired(false);

            builder.Property(spt => spt.IsDeleted).IsRequired();

            builder.Property(spt => spt.IsActive).IsRequired();

            builder.HasOne(s => s.Enterprise)
                .WithMany()
                .HasForeignKey(spt => spt.EnterpriseId)
                .HasConstraintName("FK_SupplierPaymentType_Enterprise_EnterpriseId");

            builder.HasOne(s => s.Supplier)
                .WithMany(s => s.SupplierPaymentTypes)
                .HasForeignKey(spt => spt.SupplierId)
                .HasConstraintName("FK_SupplierPaymentType_Supplier_SupplierId");

            builder.HasOne(s => s.PaymentType)
                .WithMany()
                .HasForeignKey(spt => spt.PaymentTypeId)
                .HasConstraintName("FK_SupplierPaymentType_PaymentType_PaymentTypeId");
        }
    }
}
