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
    public class UserPasswordManagementConfiguration : IEntityTypeConfiguration<UserPasswordManagement>
    {
        public void Configure(EntityTypeBuilder<UserPasswordManagement> builder)
        {
            builder.ToTable("UserPasswordManagement");

            builder.HasKey(u => u.Id)
                   .HasName("PK_UserPasswordManagement");

            builder.Property(u => u.Id)
                .IsRequired();

            builder.Property(u => u.UserId)
                .IsRequired();

            builder.Property(u => u.Code)
                .HasMaxLength(512)
                .IsRequired(false);

            builder.Property(u => u.MustChangePassword)
                .IsRequired();

            builder.Property(u => u.LastPasswordChange)
                .IsRequired(false);

            builder.Property(u => u.ExpirationDate)
                .IsRequired(false);

            builder.Property(u => u.CreatedOn)
                .IsRequired();

            builder.Property(u => u.ModifiedOn)
                .IsRequired(false);

            builder.Property(u => u.DeletedOn)
                .IsRequired(false);

            builder.Property(u => u.CreatedBy)
                .IsRequired();

            builder.Property(u => u.ModifiedBy)
                .IsRequired(false);

            builder.Property(u => u.DeletedBy)
                .IsRequired(false);

            builder.Property(u => u.IsDeleted)
                .IsRequired();

            builder.Property(u => u.IsActive)
                .IsRequired();

            builder.HasOne(u => u.User)
                .WithMany(u => u.UserPasswordManagements)
                .HasForeignKey(u => u.UserId)
                .HasConstraintName("FK_UserPasswordManagement_User_UserId");
        }
    }
}
