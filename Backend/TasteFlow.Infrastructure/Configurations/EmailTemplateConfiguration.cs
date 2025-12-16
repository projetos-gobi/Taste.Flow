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
    public class EmailTemplateConfiguration : IEntityTypeConfiguration<EmailTemplate>
    {
        public void Configure(EntityTypeBuilder<EmailTemplate> builder)
        {
            builder.ToTable("EmailTemplate");

            builder.HasKey(et => et.Id);

            builder.Property(et => et.Id)
                .IsRequired();

            builder.Property(et => et.EmailTemplateTypeId)
                .IsRequired(false);

            builder.Property(et => et.EnterpriseId)
                .IsRequired(false);

            builder.Property(et => et.Name)
                .HasMaxLength(512)
                .IsRequired();

            builder.Property(et => et.Subject)
                .HasMaxLength(512)
                .IsRequired();

            builder.Property(et => et.Body)
                .IsRequired();

            builder.Property(et => et.Placeholder)
                .IsRequired();

            builder.Property(et => et.CreatedOn)
                .IsRequired();

            builder.Property(et => et.ModifiedOn)
                .IsRequired(false);

            builder.Property(et => et.DeletedOn)
                .IsRequired(false);

            builder.Property(et => et.CreatedBy)
                .IsRequired();

            builder.Property(et => et.ModifiedBy)
                .IsRequired(false);

            builder.Property(et => et.DeletedBy)
                .IsRequired(false);

            builder.Property(et => et.IsDeleted)
                .IsRequired();

            builder.Property(et => et.IsActive)
                .IsRequired();

            builder.HasOne(et => et.EmailTemplateType)
                .WithMany()
                .HasForeignKey(et => et.EmailTemplateTypeId)
                .HasConstraintName("FK_EmailTemplate_EmailTemplateType_EmailTemplateTypeId");

            builder.HasOne(et => et.Enterprise)
                .WithMany()
                .HasForeignKey(et => et.EnterpriseId)
                .HasConstraintName("FK_EmailTemplate_Enterprise_EnterpriseId");
        }
    }
}
