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
    public class UserRefreshTokenConfiguration : IEntityTypeConfiguration<UserRefreshToken>
    {
        public void Configure(EntityTypeBuilder<UserRefreshToken> builder)
        {
            builder.ToTable("UserRefreshToken");

            builder.HasKey(urt => urt.Id);

            builder.Property(urt => urt.Id)
                .IsRequired();

            builder.Property(urt => urt.UserId)
                .IsRequired();

            builder.Property(urt => urt.RefreshToken)
                .HasMaxLength(512)
                .IsRequired();

            builder.Property(urt => urt.ExpirationDate)
                .IsRequired();

            builder.Property(urt => urt.CreatedOn)
                .IsRequired();

            builder.Property(urt => urt.ModifiedOn)
                .IsRequired(false);

            builder.Property(urt => urt.DeletedOn)
                .IsRequired(false);

            builder.Property(urt => urt.CreatedBy)
                .IsRequired();

            builder.Property(urt => urt.ModifiedBy)
                .IsRequired(false);

            builder.Property(urt => urt.DeletedBy)
                .IsRequired(false);

            builder.Property(urt => urt.IsDeleted)
                .IsRequired();

            builder.Property(urt => urt.IsActive)
                .IsRequired();

            builder.HasOne(urt => urt.User)
                .WithMany()
                .HasForeignKey(urt => urt.UserId)
                .HasConstraintName("FK_UserRefreshToken_Users_UserId");
        }
    }
}
