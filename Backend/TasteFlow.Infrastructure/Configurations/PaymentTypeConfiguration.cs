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
    public class PaymentTypeConfiguration : IEntityTypeConfiguration<PaymentType>
    {
        public void Configure(EntityTypeBuilder<PaymentType> builder)
        {
            builder.ToTable("PaymentType");

            builder.HasKey(sc => sc.Id)
                   .HasName("PK_PaymentType");

            builder.Property(sc => sc.Id)
                   .IsRequired();

            builder.Property(sc => sc.EnterpriseId);

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
                   .HasConstraintName("FK_PaymentType_Enterprise_EnterpriseId");
        }
    }
}
