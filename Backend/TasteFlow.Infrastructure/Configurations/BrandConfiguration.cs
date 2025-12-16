using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Infrastructure.Configurations
{
    public class BrandConfiguration : IEntityTypeConfiguration<Brand>
    {
        public void Configure(EntityTypeBuilder<Brand> builder)
        {
            builder.ToTable("Brand");

            builder.HasKey(sc => sc.Id)
                   .HasName("PK_Brand");

            builder.Property(sc => sc.Id)
                   .IsRequired();

            builder.Property(sc => sc.EnterpriseId)
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
                   .HasConstraintName("FK_Brand_Enterprise_EnterpriseId");
        }
    }
}
