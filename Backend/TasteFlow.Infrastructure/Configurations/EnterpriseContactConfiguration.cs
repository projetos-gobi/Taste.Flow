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
    public class EnterpriseContactConfiguration : IEntityTypeConfiguration<EnterpriseContact>
    {
        public void Configure(EntityTypeBuilder<EnterpriseContact> builder)
        {
            builder.ToTable("EnterpriseContact");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Id).IsRequired();
            builder.Property(e => e.Telephone).HasMaxLength(512);
            builder.Property(e => e.EmailAddress).HasMaxLength(512);
            builder.Property(e => e.Responsible).HasMaxLength(512);
            builder.Property(e => e.CreatedOn).IsRequired();
            builder.Property(e => e.ModifiedOn);
            builder.Property(e => e.DeletedOn);
            builder.Property(e => e.CreatedBy).IsRequired();
            builder.Property(e => e.ModifiedBy);
            builder.Property(e => e.DeletedBy);
            builder.Property(e => e.IsDeleted).IsRequired();
            builder.Property(e => e.IsActive).IsRequired();

            builder.HasOne(e => e.Enterprise)
                .WithMany(ent => ent.EnterpriseContacts)
                .HasForeignKey(e => e.EnterpriseId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
