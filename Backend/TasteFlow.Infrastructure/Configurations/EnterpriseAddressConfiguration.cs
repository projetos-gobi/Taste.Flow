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
    public class EnterpriseAddressConfiguration : IEntityTypeConfiguration<EnterpriseAddress>
    {
        public void Configure(EntityTypeBuilder<EnterpriseAddress> builder)
        {
            builder.ToTable("EnterpriseAddress");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Id).IsRequired();
            builder.Property(e => e.PostalCode).HasMaxLength(512);
            builder.Property(e => e.Street).HasMaxLength(512);
            builder.Property(e => e.Number).HasMaxLength(512);
            builder.Property(e => e.Complement).HasMaxLength(512);
            builder.Property(e => e.District).HasMaxLength(512);
            builder.Property(e => e.City).HasMaxLength(512);
            builder.Property(e => e.State).HasMaxLength(512);
            builder.Property(e => e.Latitude);
            builder.Property(e => e.Longitude);
            builder.Property(e => e.CreatedOn).IsRequired();
            builder.Property(e => e.ModifiedOn);
            builder.Property(e => e.DeletedOn);
            builder.Property(e => e.CreatedBy).IsRequired();
            builder.Property(e => e.ModifiedBy);
            builder.Property(e => e.DeletedBy);
            builder.Property(e => e.IsDeleted).IsRequired();
            builder.Property(e => e.IsActive).IsRequired();

            builder.HasOne(e => e.Enterprise)
                .WithMany(ent => ent.EnterpriseAddresses)
                .HasForeignKey(e => e.EnterpriseId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
