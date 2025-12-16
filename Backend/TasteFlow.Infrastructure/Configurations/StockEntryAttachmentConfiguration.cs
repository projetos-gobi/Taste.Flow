using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Infrastructure.Configurations
{
    public class StockEntryAttachmentConfiguration : IEntityTypeConfiguration<StockEntryAttachment>
    {
        public void Configure(EntityTypeBuilder<StockEntryAttachment> builder)
        {
            builder.ToTable("StockEntryAttachment");

            builder.HasKey(x => x.Id)
                   .HasName("PK_StockEntryAttachment");

            builder.Property(x => x.Id)
                   .IsRequired();

            builder.Property(x => x.EnterpriseId)
                   .IsRequired();

            builder.Property(x => x.StockEntryId)
                   .ValueGeneratedNever()
                   .IsRequired();

            builder.Property(x => x.FileName)
                   .HasMaxLength(512);

            builder.Property(x => x.FilePath)
                   .HasMaxLength(512);

            builder.Property(x => x.FileExtension)
                   .HasMaxLength(512);

            builder.Property(x => x.FileSize);

            builder.Property(x => x.CreatedOn)
                   .IsRequired();

            builder.Property(x => x.ModifiedOn)
                   .HasDefaultValue(null);

            builder.Property(x => x.DeletedOn)
                   .HasDefaultValue(null);

            builder.Property(x => x.CreatedBy)
                   .IsRequired();

            builder.Property(x => x.ModifiedBy)
                   .HasDefaultValue(null);

            builder.Property(x => x.DeletedBy)
                   .HasDefaultValue(null);

            builder.Property(x => x.IsDeleted)
                   .IsRequired();

            builder.Property(x => x.IsActive)
                   .IsRequired();

            builder.HasOne(x => x.Enterprise)
               .WithMany()
               .HasForeignKey(x => x.EnterpriseId)
               .HasConstraintName("FK_StockEntryItem_Enterprise_EnterpriseId");

            builder.HasOne(x => x.StockEntry)
                   .WithMany(x => x.StockEntryAttachments)
                   .HasForeignKey(x => x.StockEntryId)
                   .HasConstraintName("FK_StockEntryAttachment_StockEntry_StockEntryId");
        }
    }
}
