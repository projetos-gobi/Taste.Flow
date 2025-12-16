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
    public class SupplierPaymentDetailConfiguration : IEntityTypeConfiguration<SupplierPaymentDetail>
    {
        public void Configure(EntityTypeBuilder<SupplierPaymentDetail> builder)
        {
            builder.ToTable("SupplierPaymentDetail");

            builder.HasKey(spd => spd.Id)
                .HasName("PK_SupplierPaymentDetail");

            builder.Property(spd => spd.Id)
                .IsRequired();

            builder.Property(spd => spd.EnterpriseId)
                .IsRequired();

            builder.Property(spd => spd.SupplierId)
                .ValueGeneratedNever()
                .IsRequired();

            builder.Property(spd => spd.Agency)
                .HasMaxLength(512);

            builder.Property(spd => spd.BankAccountNumber)
                .HasMaxLength(512);

            builder.Property(spd => spd.PixKey)
                .HasMaxLength(512);

            builder.Property(spd => spd.CreatedOn)
                .IsRequired();

            builder.Property(spd => spd.ModifiedOn)
                .IsRequired(false);

            builder.Property(spd => spd.DeletedOn)
                .IsRequired(false);

            builder.Property(spd => spd.CreatedBy)
                .IsRequired();

            builder.Property(spd => spd.ModifiedBy)
                .IsRequired(false);

            builder.Property(spd => spd.DeletedBy)
                .IsRequired(false);

            builder.Property(spd => spd.IsDeleted)
                .IsRequired();

            builder.Property(spd => spd.IsActive)
                .IsRequired();

            builder.HasOne(s => s.Enterprise)
                .WithMany()
                .HasForeignKey(spd => spd.EnterpriseId)
                .HasConstraintName("FK_SupplierPaymentDetail_Enterprise_EnterpriseId");

            builder.HasOne(s => s.Supplier)
                .WithMany()
                .HasForeignKey(spd => spd.SupplierId)
                .HasConstraintName("FK_SupplierPaymentDetail_Supplier_SupplierId");

            builder.HasOne(s => s.Supplier)
                .WithOne(spd => spd.SupplierPaymentDetail)
                .HasForeignKey<SupplierPaymentDetail>(spd => spd.SupplierId)
                .HasConstraintName("FK_SupplierPaymentDetail_Supplier_SupplierId");
        }
    }
}
