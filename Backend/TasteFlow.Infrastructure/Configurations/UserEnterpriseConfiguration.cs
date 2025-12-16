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
    public class UserEnterpriseConfiguration : IEntityTypeConfiguration<UserEnterprise>
    {
        public void Configure(EntityTypeBuilder<UserEnterprise> builder)
        {
            builder.ToTable("UserEnterprise");

            builder.HasKey(ue => ue.Id)
                .HasName("PK_UserEnterprise");

            builder.Property(ue => ue.Id)
                .IsRequired()
                .HasColumnName("Id");

            builder.Property(ue => ue.UserId)
                .IsRequired()
                .HasColumnName("UserId");

            builder.Property(ue => ue.EnterpriseId)
                .IsRequired()
                .HasColumnName("EnterpriseId");

            builder.Property(ue => ue.LicenseManagementId)
                .HasColumnName("LicenseManagementId");

            builder.Property(ue => ue.ProfileTypeId)
                .HasColumnName("ProfileTypeId");

            builder.Property(ue => ue.CreatedOn)
                .IsRequired()
                .HasColumnName("CreatedOn");

            builder.Property(ue => ue.ModifiedOn)
                .HasColumnName("ModifiedOn");

            builder.Property(ue => ue.DeletedOn)
                .HasColumnName("DeletedOn");

            builder.Property(ue => ue.CreatedBy)
                .IsRequired()
                .HasColumnName("CreatedBy");

            builder.Property(ue => ue.ModifiedBy)
                .HasColumnName("ModifiedBy");

            builder.Property(ue => ue.DeletedBy)
                .HasColumnName("DeletedBy");

            builder.Property(ue => ue.IsDeleted)
                .IsRequired()
                .HasColumnName("IsDeleted");

            builder.Property(ue => ue.IsActive)
                .IsRequired()
                .HasColumnName("IsActive");

            builder.HasOne(ue => ue.User)
                .WithMany(u => u.UserEnterprises)
                .HasForeignKey(ue => ue.UserId)
                .HasConstraintName("FK_UserEnterprise_Users_UserId");


            builder.HasOne(ue => ue.Enterprise)
                .WithMany(ue => ue.UserEnterprises)
                .HasForeignKey(ue => ue.EnterpriseId)
                .HasConstraintName("FK_UserEnterprise_Enterprise_EnterpriseId");

            builder.HasOne(ue => ue.LicenseManagement)
                .WithMany()
                .HasForeignKey(ue => ue.LicenseManagementId)
                .HasConstraintName("FK_UserEnterprise_LicenseManagement_LicenseManagementId");

            builder.HasOne(ue => ue.ProfileType)
                .WithMany()
                .HasForeignKey(ue => ue.ProfileTypeId)
                .HasConstraintName("FK_UserEnterprise_ProfileType_ProfileTypeId");
        }
    }
}
