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
    public class StockEntryConfiguration : IEntityTypeConfiguration<StockEntry>
    {
        public void Configure(EntityTypeBuilder<StockEntry> builder)
        {
            builder.ToTable("StockEntry");

            builder.HasKey(se => se.Id)
                   .HasName("PK_StockEntry");

            builder.Property(se => se.Id)
                   .IsRequired();

            builder.Property(se => se.EnterpriseId)
                   .IsRequired();

            builder.Property(se => se.SupplierId)
                   .IsRequired();

            builder.Property(se => se.PaymentTypeId)
                   .IsRequired();

            builder.Property(se => se.PaymentTermId)
                   .IsRequired();

            builder.Property(se => se.PurchaseDate);

            builder.Property(se => se.ExpectedDeliveryDate);

            builder.Property(se => se.ReceivedBy)
                   .HasMaxLength(512)
                   .IsRequired();

            builder.Property(se => se.IsDeliveryCompleted)
                   .IsRequired();

            builder.Property(se => se.InvoiceNumber)
                   .HasMaxLength(512);

            builder.Property(se => se.TotalAmount)
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

            builder.Property(se => se.CreatedOn)
                   .IsRequired();

            builder.Property(se => se.ModifiedOn);

            builder.Property(se => se.DeletedOn);

            builder.Property(se => se.CreatedBy)
                   .IsRequired();

            builder.Property(se => se.ModifiedBy);

            builder.Property(se => se.DeletedBy);

            builder.Property(se => se.IsDeleted)
                   .IsRequired();

            builder.Property(se => se.IsActive)
                   .IsRequired();

            builder.HasOne(se => se.Enterprise)
                   .WithMany()
                   .HasForeignKey(se => se.EnterpriseId)
                   .HasConstraintName("FK_StockEntry_Enterprise_EnterpriseId");

            builder.HasOne(se => se.Supplier)
                   .WithMany()
                   .HasForeignKey(se => se.SupplierId)
                   .HasConstraintName("FK_StockEntry_Supplier_SupplierId");

            builder.HasOne(se => se.PaymentType)
                   .WithMany()
                   .HasForeignKey(se => se.PaymentTypeId)
                   .HasConstraintName("FK_StockEntry_PaymentType_PaymentTypeId");

            builder.HasOne(se => se.PaymentTerm)
                   .WithMany()
                   .HasForeignKey(se => se.PaymentTermId)
                   .HasConstraintName("FK_StockEntry_PaymentTerm_PaymentTermId");
        }
    }
}
