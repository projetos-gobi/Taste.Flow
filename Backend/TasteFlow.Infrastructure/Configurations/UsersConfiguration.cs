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
    public class UsersConfiguration : IEntityTypeConfiguration<Users>
    {
        public void Configure(EntityTypeBuilder<Users> builder)
        {
            builder.ToTable("Users");

            builder.HasKey(u => u.Id).HasName("PK_Users");

            builder.Property(u => u.Id)
                .IsRequired()
                .HasColumnName("Id");

            builder.Property(u => u.AccessProfileId)
                .IsRequired()
                .HasColumnName("AccessProfileId");

            builder.Property(u => u.Name)
                .IsRequired()
                .HasColumnName("Name")
                .HasMaxLength(512);

            builder.Property(u => u.EmailAddress)
                .HasColumnName("EmailAddress")
                .HasMaxLength(512)
                .IsRequired(false);

            builder.Property(u => u.Contact)
                .HasColumnName("Contact")
                .HasMaxLength(512)
                .IsRequired(false);

            builder.Property(u => u.PasswordHash)
                .HasColumnName("PasswordHash")
                .HasMaxLength(512)
                .IsRequired(false);

            builder.Property(u => u.PasswordSalt)
                .HasColumnName("PasswordSalt")
                .HasMaxLength(512)
                .IsRequired(false);

            builder.Property(u => u.MustChangePassword)
                .IsRequired()
                .HasColumnName("MustChangePassword")
                .HasDefaultValue(false);

            builder.Property(u => u.LastPasswordChange)
                .HasColumnName("LastPasswordChange")
                .IsRequired(false)
                .HasColumnType("datetime");


            builder.Property(u => u.CreatedOn)
                .IsRequired()
                .HasColumnType("datetime");

            builder.Property(u => u.ModifiedOn)
                .HasColumnName("ModifiedOn")
                .IsRequired(false);

            builder.Property(u => u.DeletedOn)
                .HasColumnName("DeletedOn")
                .IsRequired(false);

            builder.Property(u => u.CreatedBy)
                .IsRequired()
                .HasColumnName("CreatedBy");

            builder.Property(u => u.ModifiedBy)
                .HasColumnName("ModifiedBy")
                .IsRequired(false);

            builder.Property(u => u.DeletedBy)
                .HasColumnName("DeletedBy")
                .IsRequired(false);

            builder.Property(u => u.IsDeleted)
                .IsRequired()
                .HasColumnName("IsDeleted");

            builder.Property(u => u.IsActive)
                .IsRequired()
                .HasColumnName("IsActive");

            builder.HasOne(u => u.AccessProfile)
                .WithMany()
                .HasForeignKey(u => u.AccessProfileId)
                .HasConstraintName("FK_Users_AccessProfile_AccessProfileId")
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
