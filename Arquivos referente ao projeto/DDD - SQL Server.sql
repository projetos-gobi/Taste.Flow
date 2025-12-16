CREATE DATABASE TasteFlow
GO 

USE TasteFlow
GO

CREATE TABLE [dbo].[AccessProfile](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_AccessProfile] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Users](
	[Id] [uniqueidentifier] NOT NULL,
	[AccessProfileId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[EmailAddress] [nvarchar](512) NULL,
	[Contact] [nvarchar](512) NULL,
	[PasswordHash] [nvarchar](512) NULL,
	[PasswordSalt] [nvarchar](512) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Users] WITH CHECK ADD  CONSTRAINT [FK_Users_AccessProfile_AccessProfileId] FOREIGN KEY([AccessProfileId])
REFERENCES [dbo].[AccessProfile] ([Id])
GO

ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_AccessProfile_AccessProfileId]
GO

CREATE TABLE [dbo].[UserRefreshToken](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[RefreshToken] [nvarchar](512) NOT NULL,
	[ExpirationDate] [datetime] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_UserRefreshToken] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[UserRefreshToken] WITH CHECK ADD  CONSTRAINT [FK_UserRefreshToken_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[UserRefreshToken] CHECK CONSTRAINT [FK_UserRefreshToken_Users_UserId]
GO

ALTER TABLE [dbo].[UserRefreshToken] WITH CHECK ADD  CONSTRAINT [FK_UserRefreshToken_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[UserRefreshToken] CHECK CONSTRAINT [FK_UserRefreshToken_Users_CreatedBy]
GO

ALTER TABLE [dbo].[UserRefreshToken] WITH CHECK ADD  CONSTRAINT [FK_UserRefreshToken_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[UserRefreshToken] CHECK CONSTRAINT [FK_UserRefreshToken_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[UserRefreshToken] WITH CHECK ADD  CONSTRAINT [FK_UserRefreshToken_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[UserRefreshToken] CHECK CONSTRAINT [FK_UserRefreshToken_Users_DeletedBy]
GO

CREATE TABLE [dbo].[License](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[Description] [nvarchar](512) NOT NULL,
	[Value] [decimal](18, 2) NULL,
	[Order] [int] NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_License] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[License] WITH CHECK ADD  CONSTRAINT [FK_License_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[License] CHECK CONSTRAINT [FK_License_Users_CreatedBy]
GO

ALTER TABLE [dbo].[License] WITH CHECK ADD  CONSTRAINT [FK_License_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[License] CHECK CONSTRAINT [FK_License_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[License] WITH CHECK ADD  CONSTRAINT [FK_License_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[License] CHECK CONSTRAINT [FK_License_Users_DeletedBy]
GO

CREATE TABLE [dbo].[Enterprise](
	[Id] [uniqueidentifier] NOT NULL,
	[LicenseId] [uniqueidentifier] NULL,
	[MainEnterpriseId] [uniqueidentifier] NULL,
	[FantasyName] [nvarchar](512) NULL,
	[SocialReason] [nvarchar](512) NULL,
	[Cnpj] [nvarchar](512) NULL,
	[LicenseQuantity] [int] NULL,
	[HasUnlimitedLicenses] [bit] NOT NULL DEFAULT 0,
	[IsHeadOffice] [bit] NOT NULL,
	[StateRegistration] [nvarchar](512) NULL,
    [MunicipalRegistration] [nvarchar](512) NULL,
    [Observation] [nvarchar](1024) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_Enterprise] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Enterprise] WITH CHECK ADD  CONSTRAINT [FK_Enterprise_License_LicenseId] FOREIGN KEY([LicenseId])
REFERENCES [dbo].[License] ([Id])
GO

ALTER TABLE [dbo].[Enterprise] CHECK CONSTRAINT [FK_Enterprise_License_LicenseId]
GO

ALTER TABLE [dbo].[Enterprise] WITH CHECK ADD  CONSTRAINT [FK_Enterprise_Enterprise_MainEnterpriseId] FOREIGN KEY([MainEnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[Enterprise] CHECK CONSTRAINT [FK_Enterprise_Enterprise_MainEnterpriseId]
GO

ALTER TABLE [dbo].[Enterprise] WITH CHECK ADD  CONSTRAINT [FK_Enterprise_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Enterprise] CHECK CONSTRAINT [FK_Enterprise_Users_CreatedBy]
GO

ALTER TABLE [dbo].[Enterprise] WITH CHECK ADD  CONSTRAINT [FK_Enterprise_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Enterprise] CHECK CONSTRAINT [FK_Enterprise_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[Enterprise] WITH CHECK ADD  CONSTRAINT [FK_Enterprise_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Enterprise] CHECK CONSTRAINT [FK_Enterprise_Users_DeletedBy]
GO


CREATE TABLE [dbo].[EnterpriseAddress](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NULL,
	[PostalCode] [nvarchar](512) NULL,
	[Street] [nvarchar](512) NULL,
	[Number] [nvarchar](512) NULL,
	[Complement] [nvarchar](512) NULL,
	[District] [nvarchar](512) NULL,
	[City] [nvarchar](512) NULL,
	[State] [nvarchar](512) NULL,
	[Latitude] [float] NULL,
	[Longitude] [float] NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_EnterpriseAddress] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[EnterpriseAddress] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseAddress_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseAddress] CHECK CONSTRAINT [FK_EnterpriseAddress_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[EnterpriseAddress] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseAddress_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseAddress] CHECK CONSTRAINT [FK_EnterpriseAddress_Users_CreatedBy]
GO

ALTER TABLE [dbo].[EnterpriseAddress] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseAddress_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseAddress] CHECK CONSTRAINT [FK_EnterpriseAddress_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[EnterpriseAddress] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseAddress_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseAddress] CHECK CONSTRAINT [FK_EnterpriseAddress_Users_DeletedBy]
GO

CREATE TABLE [dbo].[EnterpriseContact](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NULL,
	[Telephone] [nvarchar](512) NULL,
	[EmailAddress] [nvarchar](512) NULL,
	[Responsible] [nvarchar](512) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_EnterpriseContact] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[EnterpriseContact] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseContact_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseContact] CHECK CONSTRAINT [FK_EnterpriseContact_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[EnterpriseContact] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseContact_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseContact] CHECK CONSTRAINT [FK_EnterpriseContact_Users_CreatedBy]
GO

ALTER TABLE [dbo].[EnterpriseContact] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseContact_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseContact] CHECK CONSTRAINT [FK_EnterpriseContact_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[EnterpriseContact] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseContact_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseContact] CHECK CONSTRAINT [FK_EnterpriseContact_Users_DeletedBy]
GO

CREATE TABLE [dbo].[EnterpriseRelationship](
	[Id] [uniqueidentifier] NOT NULL,
	[MainEnterpriseId] [uniqueidentifier] NOT NULL,
	[BranchEnterpriseId] [uniqueidentifier] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_EnterpriseRelationship] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[EnterpriseRelationship] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseRelationship_Enterprise_MainEnterpriseId] FOREIGN KEY([MainEnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseRelationship] CHECK CONSTRAINT [FK_EnterpriseRelationship_Enterprise_MainEnterpriseId]
GO

ALTER TABLE [dbo].[EnterpriseRelationship] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseRelationship_Enterprise_BranchEnterpriseId] FOREIGN KEY([BranchEnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseRelationship] CHECK CONSTRAINT [FK_EnterpriseRelationship_Enterprise_BranchEnterpriseId]
GO

ALTER TABLE [dbo].[EnterpriseRelationship] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseRelationship_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseRelationship] CHECK CONSTRAINT [FK_EnterpriseRelationship_Users_CreatedBy]
GO

ALTER TABLE [dbo].[EnterpriseRelationship] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseRelationship_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseRelationship] CHECK CONSTRAINT [FK_EnterpriseRelationship_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[EnterpriseRelationship] WITH CHECK ADD  CONSTRAINT [FK_EnterpriseRelationship_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EnterpriseRelationship] CHECK CONSTRAINT [FK_EnterpriseRelationship_Users_DeletedBy]
GO

CREATE TABLE [dbo].[LicenseManagement](
	[Id] [uniqueidentifier] NOT NULL,
	[LicenseId] [uniqueidentifier] NULL,
	[EnterpriseId] [uniqueidentifier] NULL,
	[LicenseCode] [nvarchar](512) NULL,
	[ExpirationDate] [datetime] NOT NULL,
	[IsIndefinite] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_LicenseManagement] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[LicenseManagement] WITH CHECK ADD  CONSTRAINT [FK_LicenseManagement_License_LicenseId] FOREIGN KEY([LicenseId])
REFERENCES [dbo].[License] ([Id])
GO

ALTER TABLE [dbo].[LicenseManagement] CHECK CONSTRAINT [FK_LicenseManagement_License_LicenseId]
GO

ALTER TABLE [dbo].[LicenseManagement] WITH CHECK ADD  CONSTRAINT [FK_LicenseManagement_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[LicenseManagement] CHECK CONSTRAINT [FK_LicenseManagement_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[LicenseManagement] WITH CHECK ADD  CONSTRAINT [FK_LicenseManagement_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[LicenseManagement] CHECK CONSTRAINT [FK_LicenseManagement_Users_CreatedBy]
GO

ALTER TABLE [dbo].[LicenseManagement] WITH CHECK ADD  CONSTRAINT [FK_LicenseManagement_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[LicenseManagement] CHECK CONSTRAINT [FK_LicenseManagement_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[LicenseManagement] WITH CHECK ADD  CONSTRAINT [FK_LicenseManagement_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[LicenseManagement] CHECK CONSTRAINT [FK_LicenseManagement_Users_DeletedBy]
GO

CREATE TABLE [dbo].[ProfileType](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NULL,
	[Name] [nvarchar](512) NOT NULL,
	[Description] [nvarchar](512) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_ProfileType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProfileType] WITH CHECK ADD  CONSTRAINT [FK_ProfileType_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[ProfileType] CHECK CONSTRAINT [FK_ProfileType_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[ProfileType] WITH CHECK ADD  CONSTRAINT [FK_ProfileType_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProfileType] CHECK CONSTRAINT [FK_ProfileType_Users_CreatedBy]
GO

ALTER TABLE [dbo].[ProfileType] WITH CHECK ADD  CONSTRAINT [FK_ProfileType_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProfileType] CHECK CONSTRAINT [FK_ProfileType_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[ProfileType] WITH CHECK ADD  CONSTRAINT [FK_ProfileType_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProfileType] CHECK CONSTRAINT [FK_ProfileType_Users_DeletedBy]
GO

CREATE TABLE [dbo].[UserEnterprise](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[LicenseManagementId] [uniqueidentifier] NULL,
	[ProfileTypeId] [uniqueidentifier] NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_UserEnterprise] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[UserEnterprise] WITH CHECK ADD  CONSTRAINT [FK_UserEnterprise_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[UserEnterprise] CHECK CONSTRAINT [FK_UserEnterprise_Users_UserId]
GO

ALTER TABLE [dbo].[UserEnterprise] WITH CHECK ADD  CONSTRAINT [FK_UserEnterprise_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[UserEnterprise] CHECK CONSTRAINT [FK_UserEnterprise_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[UserEnterprise] WITH CHECK ADD  CONSTRAINT [FK_UserEnterprise_LicenseManagement_LicenseManagementId] FOREIGN KEY([LicenseManagementId])
REFERENCES [dbo].[LicenseManagement] ([Id])
GO

ALTER TABLE [dbo].[UserEnterprise] CHECK CONSTRAINT [FK_UserEnterprise_LicenseManagement_LicenseManagementId]
GO

ALTER TABLE [dbo].[UserEnterprise] WITH CHECK ADD  CONSTRAINT [FK_UserEnterprise_ProfileType_ProfileTypeId] FOREIGN KEY([ProfileTypeId])
REFERENCES [dbo].[ProfileType] ([Id])
GO

ALTER TABLE [dbo].[UserEnterprise] CHECK CONSTRAINT [FK_UserEnterprise_ProfileType_ProfileTypeId]
GO

ALTER TABLE [dbo].[UserEnterprise] WITH CHECK ADD  CONSTRAINT [FK_UserEnterprise_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[UserEnterprise] CHECK CONSTRAINT [FK_UserEnterprise_Users_CreatedBy]
GO

ALTER TABLE [dbo].[UserEnterprise] WITH CHECK ADD  CONSTRAINT [FK_UserEnterprise_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[UserEnterprise] CHECK CONSTRAINT [FK_UserEnterprise_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[UserEnterprise] WITH CHECK ADD  CONSTRAINT [FK_UserEnterprise_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[UserEnterprise] CHECK CONSTRAINT [FK_UserEnterprise_Users_DeletedBy]
GO

CREATE TABLE [dbo].[Unit](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[Value] [decimal](18,4) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Unit] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Unit] WITH CHECK ADD  CONSTRAINT [FK_Unit_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[Unit] CHECK CONSTRAINT [FK_Unit_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[Unit] WITH CHECK ADD  CONSTRAINT [FK_Unit_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Unit] CHECK CONSTRAINT [FK_Unit_Users_CreatedBy]
GO

ALTER TABLE [dbo].[Unit] WITH CHECK ADD  CONSTRAINT [FK_Unit_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Unit] CHECK CONSTRAINT [FK_Unit_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[Unit] WITH CHECK ADD  CONSTRAINT [FK_Unit_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Unit] CHECK CONSTRAINT [FK_Unit_Users_DeletedBy]
GO

CREATE TABLE [dbo].[Item](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Item] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Item] WITH CHECK ADD  CONSTRAINT [FK_Item_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[Item] CHECK CONSTRAINT [FK_Item_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[Item] WITH CHECK ADD  CONSTRAINT [FK_Item_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Item] CHECK CONSTRAINT [FK_Item_Users_CreatedBy]
GO

ALTER TABLE [dbo].[Item] WITH CHECK ADD  CONSTRAINT [FK_Item_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Item] CHECK CONSTRAINT [FK_Item_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[Item] WITH CHECK ADD  CONSTRAINT [FK_Item_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Item] CHECK CONSTRAINT [FK_Item_Users_DeletedBy]
GO

CREATE TABLE [dbo].[ProductType](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_ProductType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductType] WITH CHECK ADD  CONSTRAINT [FK_ProductType_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[ProductType] CHECK CONSTRAINT [FK_ProductType_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[ProductType] WITH CHECK ADD  CONSTRAINT [FK_ProductType_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductType] CHECK CONSTRAINT [FK_ProductType_Users_CreatedBy]
GO

ALTER TABLE [dbo].[ProductType] WITH CHECK ADD  CONSTRAINT [FK_ProductType_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductType] CHECK CONSTRAINT [FK_ProductType_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[ProductType] WITH CHECK ADD  CONSTRAINT [FK_ProductType_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductType] CHECK CONSTRAINT [FK_ProductType_Users_DeletedBy]
GO

CREATE TABLE [dbo].[Brand](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Brand] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Brand] WITH CHECK ADD  CONSTRAINT [FK_Brand_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[Brand] CHECK CONSTRAINT [FK_Brand_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[Brand] WITH CHECK ADD  CONSTRAINT [FK_Brand_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Brand] CHECK CONSTRAINT [FK_Brand_Users_CreatedBy]
GO

ALTER TABLE [dbo].[Brand] WITH CHECK ADD  CONSTRAINT [FK_Brand_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Brand] CHECK CONSTRAINT [FK_Brand_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[Brand] WITH CHECK ADD  CONSTRAINT [FK_Brand_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Brand] CHECK CONSTRAINT [FK_Brand_Users_DeletedBy]
GO

CREATE TABLE [dbo].[CategoryType](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_CategoryType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[CategoryType] WITH CHECK ADD  CONSTRAINT [FK_CategoryType_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[CategoryType] CHECK CONSTRAINT [FK_CategoryType_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[CategoryType] WITH CHECK ADD  CONSTRAINT [FK_CategoryType_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[CategoryType] CHECK CONSTRAINT [FK_CategoryType_Users_CreatedBy]
GO

ALTER TABLE [dbo].[CategoryType] WITH CHECK ADD  CONSTRAINT [FK_CategoryType_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[CategoryType] CHECK CONSTRAINT [FK_CategoryType_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[CategoryType] WITH CHECK ADD  CONSTRAINT [FK_CategoryType_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[CategoryType] CHECK CONSTRAINT [FK_CategoryType_Users_DeletedBy]
GO

CREATE TABLE [dbo].[Category](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[CategoryTypeId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Category] WITH CHECK ADD  CONSTRAINT [FK_Category_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[Category] CHECK CONSTRAINT [FK_Category_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[Category] WITH CHECK ADD  CONSTRAINT [FK_Category_CategoryType_EnterpriseId] FOREIGN KEY([CategoryTypeId])
REFERENCES [dbo].[CategoryType] ([Id])
GO

ALTER TABLE [dbo].[Category] CHECK CONSTRAINT [FK_Category_CategoryType_EnterpriseId]
GO

ALTER TABLE [dbo].[Category]  WITH CHECK ADD  CONSTRAINT [FK_Category_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Category] CHECK CONSTRAINT [FK_Category_Users_CreatedBy]
GO

ALTER TABLE [dbo].[Category]  WITH CHECK ADD  CONSTRAINT [FK_Category_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Category] CHECK CONSTRAINT [FK_Category_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[Category]  WITH CHECK ADD  CONSTRAINT [FK_Category_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Category] CHECK CONSTRAINT [FK_Category_Users_DeletedBy]
GO

CREATE TABLE [dbo].[SubCategory](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_SubCategory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[SubCategory] WITH CHECK ADD  CONSTRAINT [FK_SubCategory_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[SubCategory] CHECK CONSTRAINT [FK_SubCategory_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[SubCategory] WITH CHECK ADD  CONSTRAINT [FK_SubCategory_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[SubCategory] CHECK CONSTRAINT [FK_SubCategory_Users_CreatedBy]
GO

ALTER TABLE [dbo].[SubCategory] WITH CHECK ADD  CONSTRAINT [FK_SubCategory_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[SubCategory] CHECK CONSTRAINT [FK_SubCategory_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[SubCategory] WITH CHECK ADD  CONSTRAINT [FK_SubCategory_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[SubCategory] CHECK CONSTRAINT [FK_SubCategory_Users_DeletedBy]
GO

CREATE TABLE [dbo].[PaymentType](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NULL,
	[Name] [nvarchar](512) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_PaymentType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[PaymentType] WITH CHECK ADD  CONSTRAINT [FK_PaymentType_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[PaymentType] CHECK CONSTRAINT [FK_PaymentType_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[PaymentType] WITH CHECK ADD  CONSTRAINT [FK_PaymentType_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[PaymentType] CHECK CONSTRAINT [FK_PaymentType_Users_CreatedBy]
GO

ALTER TABLE [dbo].[PaymentType] WITH CHECK ADD  CONSTRAINT [FK_PaymentType_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[PaymentType] CHECK CONSTRAINT [FK_PaymentType_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[PaymentType] WITH CHECK ADD  CONSTRAINT [FK_PaymentType_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[PaymentType] CHECK CONSTRAINT [FK_PaymentType_Users_DeletedBy]
GO

CREATE TABLE [dbo].[Supplier](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[PaymentTypeId] [uniqueidentifier] NOT NULL,
	[CategoryId] [uniqueidentifier] NOT NULL,
	[SubCategoryId] [uniqueidentifier] NOT NULL,
	[FantasyName] [nvarchar](512) NULL,
	[SocialReason] [nvarchar](512) NULL,
	[Cnpj] [nvarchar](512) NULL,
	[Telephone] [nvarchar](512) NULL,
	[Address] [nvarchar](512) NULL,
	[Latitude] [float] NULL,
	[Longitude] [float] NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_Supplier] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Supplier] WITH CHECK ADD  CONSTRAINT [FK_Supplier_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[Supplier] CHECK CONSTRAINT [FK_Supplier_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[Supplier] WITH CHECK ADD  CONSTRAINT [FK_Supplier_PaymentType_PaymentTypeId] FOREIGN KEY([PaymentTypeId])
REFERENCES [dbo].[PaymentType] ([Id])
GO

ALTER TABLE [dbo].[Supplier] CHECK CONSTRAINT [FK_Supplier_PaymentType_PaymentTypeId]
GO

ALTER TABLE [dbo].[Supplier] WITH CHECK ADD  CONSTRAINT [FK_Supplier_Category_CategoryId] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Category] ([Id])
GO

ALTER TABLE [dbo].[Supplier] CHECK CONSTRAINT [FK_Supplier_Category_CategoryId]
GO

ALTER TABLE [dbo].[Supplier] WITH CHECK ADD  CONSTRAINT [FK_Supplier_SubCategory_SubCategoryId] FOREIGN KEY([SubCategoryId])
REFERENCES [dbo].[SubCategory] ([Id])
GO

ALTER TABLE [dbo].[Supplier] CHECK CONSTRAINT [FK_Supplier_SubCategory_SubCategoryId]
GO

ALTER TABLE [dbo].[Supplier] WITH CHECK ADD  CONSTRAINT [FK_Supplier_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Supplier] CHECK CONSTRAINT [FK_Supplier_Users_CreatedBy]
GO

ALTER TABLE [dbo].[Supplier] WITH CHECK ADD  CONSTRAINT [FK_Supplier_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Supplier] CHECK CONSTRAINT [FK_Supplier_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[Supplier] WITH CHECK ADD  CONSTRAINT [FK_Supplier_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Supplier] CHECK CONSTRAINT [FK_Supplier_Users_DeletedBy]
GO

CREATE TABLE [dbo].[SupplierPaymentDetail](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[SupplierId] [uniqueidentifier] NOT NULL,
	[Agency] [nvarchar](512) NULL,
	[BankAccountNumber] [nvarchar](512) NULL,
	[PixKey] [nvarchar](512) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_SupplierPaymentDetail] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[SupplierPaymentDetail] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentDetail_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentDetail] CHECK CONSTRAINT [FK_SupplierPaymentDetail_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[SupplierPaymentDetail] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentDetail_Supplier_SupplierId] FOREIGN KEY([SupplierId])
REFERENCES [dbo].[Supplier] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentDetail] CHECK CONSTRAINT [FK_SupplierPaymentDetail_Supplier_SupplierId]
GO

ALTER TABLE [dbo].[SupplierPaymentDetail] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentDetail_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentDetail] CHECK CONSTRAINT [FK_SupplierPaymentDetail_Users_CreatedBy]
GO

ALTER TABLE [dbo].[SupplierPaymentDetail] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentDetail_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentDetail] CHECK CONSTRAINT [FK_SupplierPaymentDetail_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[SupplierPaymentDetail] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentDetail_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentDetail] CHECK CONSTRAINT [FK_SupplierPaymentDetail_Users_DeletedBy]
GO

CREATE TABLE [dbo].[SupplierPaymentType](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[SupplierId] [uniqueidentifier] NOT NULL,
	[PaymentTypeId] [uniqueidentifier] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
CONSTRAINT [PK_SupplierPaymentType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[SupplierPaymentType] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentType_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentType] CHECK CONSTRAINT [FK_SupplierPaymentType_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[SupplierPaymentType] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentType_Supplier_SupplierId] FOREIGN KEY([SupplierId])
REFERENCES [dbo].[Supplier] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentType] CHECK CONSTRAINT [FK_SupplierPaymentType_Supplier_SupplierId]
GO

ALTER TABLE [dbo].[SupplierPaymentType] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentType_PaymentType_PaymentTypeId] FOREIGN KEY([PaymentTypeId])
REFERENCES [dbo].[PaymentType] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentType] CHECK CONSTRAINT [FK_SupplierPaymentType_PaymentType_PaymentTypeId]
GO

ALTER TABLE [dbo].[SupplierPaymentType] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentType_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentType] CHECK CONSTRAINT [FK_SupplierPaymentType_Users_CreatedBy]
GO

ALTER TABLE [dbo].[SupplierPaymentType] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentType_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentType] CHECK CONSTRAINT [FK_SupplierPaymentType_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[SupplierPaymentType] WITH CHECK ADD  CONSTRAINT [FK_SupplierPaymentType_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[SupplierPaymentType] CHECK CONSTRAINT [FK_SupplierPaymentType_Users_DeletedBy]
GO

CREATE TABLE [dbo].[Merchandise](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[BrandId] [uniqueidentifier] NOT NULL,
	[ProductTypeId] [uniqueidentifier] NULL,
	[CategoryId] [uniqueidentifier] NOT NULL,
	[UnitId] [uniqueidentifier] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Merchandise] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Merchandise] WITH CHECK ADD  CONSTRAINT [FK_Merchandise_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[Merchandise] CHECK CONSTRAINT [FK_Merchandise_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[Merchandise] WITH CHECK ADD  CONSTRAINT [FK_Merchandise_Item_ItemId] FOREIGN KEY([ItemId])
REFERENCES [dbo].[Item] ([Id])
GO

ALTER TABLE [dbo].[Merchandise] CHECK CONSTRAINT [FK_Merchandise_Item_ItemId]
GO

ALTER TABLE [dbo].[Merchandise] WITH CHECK ADD  CONSTRAINT [FK_Merchandise_Brand_BrandId] FOREIGN KEY([BrandId])
REFERENCES [dbo].[Brand] ([Id])
GO

ALTER TABLE [dbo].[Merchandise] CHECK CONSTRAINT [FK_Merchandise_Brand_BrandId]
GO

ALTER TABLE [dbo].[Merchandise] WITH CHECK ADD  CONSTRAINT [FK_Merchandise_ProductType_ProductTypeId] FOREIGN KEY([ProductTypeId])
REFERENCES [dbo].[ProductType] ([Id])
GO

ALTER TABLE [dbo].[Merchandise] CHECK CONSTRAINT [FK_Merchandise_ProductType_ProductTypeId]
GO

ALTER TABLE [dbo].[Merchandise] WITH CHECK ADD  CONSTRAINT [FK_Merchandise_Category_CategoryId] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Category] ([Id])
GO

ALTER TABLE [dbo].[Merchandise] CHECK CONSTRAINT [FK_Merchandise_Category_CategoryId]
GO

ALTER TABLE [dbo].[Merchandise] WITH CHECK ADD  CONSTRAINT [FK_Merchandise_Unit_UnitId] FOREIGN KEY([UnitId])
REFERENCES [dbo].[Unit] ([Id])
GO

ALTER TABLE [dbo].[Merchandise] CHECK CONSTRAINT [FK_Merchandise_Unit_UnitId]
GO

ALTER TABLE [dbo].[Merchandise] WITH CHECK ADD  CONSTRAINT [FK_Merchandise_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Merchandise] CHECK CONSTRAINT [FK_Merchandise_Users_CreatedBy]
GO

ALTER TABLE [dbo].[Merchandise] WITH CHECK ADD  CONSTRAINT [FK_Merchandise_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Merchandise] CHECK CONSTRAINT [FK_Merchandise_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[Merchandise] WITH CHECK ADD  CONSTRAINT [FK_Merchandise_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Merchandise] CHECK CONSTRAINT [FK_Merchandise_Users_DeletedBy]
GO

CREATE TABLE [dbo].[ProductIntermediate](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[CategoryId] [uniqueidentifier] NULL,
	[SubCategoryId] [uniqueidentifier] NULL,
	[UnitId] [uniqueidentifier] NULL,
	[Name] [nvarchar](512) NOT NULL,
	[Description] [nvarchar](2048) NOT NULL,
	[Instruction] [nvarchar](max) NOT NULL,
	[Price] [decimal](18, 2) NULL,
	[Yield] [decimal](5, 2) NOT NULL,
	[PreparationTime] [int] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[DeletedOn] [datetime] NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL,
	[DeletedBy] [uniqueidentifier] NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_ProductIntermediate] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductIntermediate] ADD  DEFAULT (NULL) FOR [ModifiedOn]
GO

ALTER TABLE [dbo].[ProductIntermediate] ADD  DEFAULT (NULL) FOR [DeletedOn]
GO

ALTER TABLE [dbo].[ProductIntermediate] ADD  DEFAULT (NULL) FOR [ModifiedBy]
GO

ALTER TABLE [dbo].[ProductIntermediate] ADD  DEFAULT (NULL) FOR [DeletedBy]
GO

ALTER TABLE [dbo].[ProductIntermediate]  WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediate_Category_CategoryId] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Category] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediate] CHECK CONSTRAINT [FK_ProductIntermediate_Category_CategoryId]
GO

ALTER TABLE [dbo].[ProductIntermediate]  WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediate_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediate] CHECK CONSTRAINT [FK_ProductIntermediate_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[ProductIntermediate]  WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediate_SubCategory_SubCategoryId] FOREIGN KEY([SubCategoryId])
REFERENCES [dbo].[SubCategory] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediate] CHECK CONSTRAINT [FK_ProductIntermediate_SubCategory_SubCategoryId]
GO

ALTER TABLE [dbo].[ProductIntermediate]  WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediate_Unit_UnitId] FOREIGN KEY([UnitId])
REFERENCES [dbo].[Unit] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediate] CHECK CONSTRAINT [FK_ProductIntermediate_Unit_UnitId]
GO

ALTER TABLE [dbo].[ProductIntermediate]  WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediate_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediate] CHECK CONSTRAINT [FK_ProductIntermediate_Users_CreatedBy]
GO

ALTER TABLE [dbo].[ProductIntermediate]  WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediate_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediate] CHECK CONSTRAINT [FK_ProductIntermediate_Users_DeletedBy]
GO

ALTER TABLE [dbo].[ProductIntermediate]  WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediate_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediate] CHECK CONSTRAINT [FK_ProductIntermediate_Users_ModifiedBy]
GO

CREATE TABLE [dbo].[ProductIntermediateComposition](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[ProductIntermediateId] [uniqueidentifier] NOT NULL,
	[MerchandiseId] [uniqueidentifier] NULL,
	[UnitId] [uniqueidentifier] NOT NULL,
	[Quantity] [decimal](18,4) NOT NULL,
	[Yield] [decimal](5,2) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_ProductIntermediateComposition] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediateComposition_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] CHECK CONSTRAINT [FK_ProductIntermediateComposition_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediateComposition_ProductIntermediate_ProductIntermediateId] FOREIGN KEY([ProductIntermediateId])
REFERENCES [dbo].[ProductIntermediate] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] CHECK CONSTRAINT [FK_ProductIntermediateComposition_ProductIntermediate_ProductIntermediateId]
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediateComposition_Merchandise_MerchandiseId] FOREIGN KEY([MerchandiseId])
REFERENCES [dbo].[Merchandise] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] CHECK CONSTRAINT [FK_ProductIntermediateComposition_Merchandise_MerchandiseId]
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediateComposition_Unit_UnitId] FOREIGN KEY([UnitId])
REFERENCES [dbo].[Unit] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] CHECK CONSTRAINT [FK_ProductIntermediateComposition_Unit_UnitId]
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediateComposition_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] CHECK CONSTRAINT [FK_ProductIntermediateComposition_Users_CreatedBy]
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediateComposition_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] CHECK CONSTRAINT [FK_ProductIntermediateComposition_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductIntermediateComposition_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductIntermediateComposition] CHECK CONSTRAINT [FK_ProductIntermediateComposition_Users_DeletedBy]
GO

CREATE TABLE [dbo].[Product](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[CategoryId] [uniqueidentifier] NOT NULL,
	[SubCategoryId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[Instruction] [nvarchar](max) NULL,
	[Price] [decimal](18,2) NULL,
	[Yield] [int] NOT NULL,
	[Multiplier] [decimal](18,4) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Product] WITH CHECK ADD  CONSTRAINT [FK_Product_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[Product] WITH CHECK ADD  CONSTRAINT [FK_Product_Category_CategoryId] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Category] ([Id])
GO

ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_Category_CategoryId]
GO

ALTER TABLE [dbo].[Product] WITH CHECK ADD  CONSTRAINT [FK_Product_SubCategory_SubCategoryId] FOREIGN KEY([SubCategoryId])
REFERENCES [dbo].[SubCategory] ([Id])
GO

ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_SubCategory_SubCategoryId]
GO

ALTER TABLE [dbo].[Product] WITH CHECK ADD  CONSTRAINT [FK_Product_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_Users_CreatedBy]
GO

ALTER TABLE [dbo].[Product] WITH CHECK ADD  CONSTRAINT [FK_Product_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[Product] WITH CHECK ADD  CONSTRAINT [FK_Product_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_Users_DeletedBy]
GO

CREATE TABLE [dbo].[ProductComposition](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[ProductId] [uniqueidentifier] NOT NULL,
	[MerchandiseId] [uniqueidentifier] NULL,
	[ProductIntermediateId] [uniqueidentifier] NULL,
	[UnitId] [uniqueidentifier] NOT NULL,
	[Quantity] [decimal](18,4) NOT NULL,
	[Yield] [decimal](5,2) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_ProductComposition] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductComposition_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[ProductComposition] CHECK CONSTRAINT [FK_ProductComposition_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[ProductComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductComposition_Product_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Product] ([Id])
GO

ALTER TABLE [dbo].[ProductComposition] CHECK CONSTRAINT [FK_ProductComposition_Product_ProductId]
GO

ALTER TABLE [dbo].[ProductComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductComposition_Merchandise_MerchandiseId] FOREIGN KEY([MerchandiseId])
REFERENCES [dbo].[Merchandise] ([Id])
GO

ALTER TABLE [dbo].[ProductComposition] CHECK CONSTRAINT [FK_ProductComposition_Merchandise_MerchandiseId]
GO

ALTER TABLE [dbo].[ProductComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductComposition_ProductIntermediate_ProductIntermediateId] FOREIGN KEY([ProductIntermediateId])
REFERENCES [dbo].[ProductIntermediate] ([Id])
GO

ALTER TABLE [dbo].[ProductComposition] CHECK CONSTRAINT [FK_ProductComposition_ProductIntermediate_ProductIntermediateId]
GO

ALTER TABLE [dbo].[ProductComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductComposition_Unit_UnitId] FOREIGN KEY([UnitId])
REFERENCES [dbo].[Unit] ([Id])
GO

ALTER TABLE [dbo].[ProductComposition] CHECK CONSTRAINT [FK_ProductComposition_Unit_UnitId]
GO

ALTER TABLE [dbo].[ProductComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductComposition_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductComposition] CHECK CONSTRAINT [FK_ProductComposition_Users_CreatedBy]
GO

ALTER TABLE [dbo].[ProductComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductComposition_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductComposition] CHECK CONSTRAINT [FK_ProductComposition_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[ProductComposition] WITH CHECK ADD  CONSTRAINT [FK_ProductComposition_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[ProductComposition] CHECK CONSTRAINT [FK_ProductComposition_Users_DeletedBy]
GO

CREATE TABLE [dbo].[StockEntry](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[SupplierId] [uniqueidentifier] NOT NULL,
	[PurchaseDate] [datetime] NULL,
	[ExpectedDeliveryDate] [datetime] NULL,
	[ReceivedBy] [nvarchar](512) NOT NULL,
	[InvoiceNumber] [nvarchar](512) NULL,
	[TotalAmount] [decimal](18,2) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_StockEntry] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[StockEntry] WITH CHECK ADD  CONSTRAINT [FK_StockEntry_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[StockEntry] CHECK CONSTRAINT [FK_StockEntry_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[StockEntry] WITH CHECK ADD  CONSTRAINT [FK_StockEntry_Supplier_SupplierId] FOREIGN KEY([SupplierId])
REFERENCES [dbo].[Supplier] ([Id])
GO

ALTER TABLE [dbo].[StockEntry] CHECK CONSTRAINT [FK_StockEntry_Supplier_SupplierId]
GO

ALTER TABLE [dbo].[StockEntry] WITH CHECK ADD  CONSTRAINT [FK_StockEntry_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[StockEntry] CHECK CONSTRAINT [FK_StockEntry_Users_CreatedBy]
GO

ALTER TABLE [dbo].[StockEntry] WITH CHECK ADD  CONSTRAINT [FK_StockEntry_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[StockEntry] CHECK CONSTRAINT [FK_StockEntry_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[StockEntry] WITH CHECK ADD  CONSTRAINT [FK_StockEntry_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[StockEntry] CHECK CONSTRAINT [FK_StockEntry_Users_DeletedBy]
GO

CREATE TABLE [dbo].[StockEntryItem](
	[Id] [uniqueidentifier] NOT NULL,
	[EnterpriseId] [uniqueidentifier] NOT NULL,
	[StockEntryId] [uniqueidentifier] NOT NULL,
	[UnitId] [uniqueidentifier] NOT NULL,
	[Quantity] [decimal](18,4) NOT NULL,
	[TotalAmount] [decimal](18,2) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_StockEntryItem] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[StockEntryItem] WITH CHECK ADD  CONSTRAINT [FK_StockEntryItem_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[StockEntryItem] CHECK CONSTRAINT [FK_StockEntryItem_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[StockEntryItem] WITH CHECK ADD  CONSTRAINT [FK_StockEntryItem_StockEntry_StockEntryId] FOREIGN KEY([StockEntryId])
REFERENCES [dbo].[StockEntry] ([Id])
GO

ALTER TABLE [dbo].[StockEntryItem] CHECK CONSTRAINT [FK_StockEntryItem_StockEntry_StockEntryId]
GO

ALTER TABLE [dbo].[StockEntryItem] WITH CHECK ADD  CONSTRAINT [FK_StockEntryItem_Unit_UnitId] FOREIGN KEY([UnitId])
REFERENCES [dbo].[Unit] ([Id])
GO

ALTER TABLE [dbo].[StockEntryItem] CHECK CONSTRAINT [FK_StockEntryItem_Unit_UnitId]
GO

ALTER TABLE [dbo].[StockEntryItem] WITH CHECK ADD  CONSTRAINT [FK_StockEntryItem_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[StockEntryItem] CHECK CONSTRAINT [FK_StockEntryItem_Users_CreatedBy]
GO

ALTER TABLE [dbo].[StockEntryItem] WITH CHECK ADD  CONSTRAINT [FK_StockEntryItem_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[StockEntryItem] CHECK CONSTRAINT [FK_StockEntryItem_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[StockEntryItem] WITH CHECK ADD  CONSTRAINT [FK_StockEntryItem_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[StockEntryItem] CHECK CONSTRAINT [FK_StockEntryItem_Users_DeletedBy]
GO

CREATE TABLE [dbo].[EmailStatus](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_EmailStatus] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[EmailStatus] WITH CHECK ADD  CONSTRAINT [FK_EmailStatus_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EmailStatus] CHECK CONSTRAINT [FK_EmailStatus_Users_CreatedBy]
GO

ALTER TABLE [dbo].[EmailStatus] WITH CHECK ADD  CONSTRAINT [FK_EmailStatus_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EmailStatus] CHECK CONSTRAINT [FK_EmailStatus_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[EmailStatus] WITH CHECK ADD  CONSTRAINT [FK_EmailStatus_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EmailStatus] CHECK CONSTRAINT [FK_EmailStatus_Users_DeletedBy]
GO

CREATE TABLE [dbo].[EmailTemplateType](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](512) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_EmailTemplateType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[EmailTemplateType] WITH CHECK ADD  CONSTRAINT [FK_EmailTemplateType_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EmailTemplateType] CHECK CONSTRAINT [FK_EmailTemplateType_Users_CreatedBy]
GO

ALTER TABLE [dbo].[EmailTemplateType] WITH CHECK ADD  CONSTRAINT [FK_EmailTemplateType_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EmailTemplateType] CHECK CONSTRAINT [FK_EmailTemplateType_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[EmailTemplateType] WITH CHECK ADD  CONSTRAINT [FK_EmailTemplateType_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EmailTemplateType] CHECK CONSTRAINT [FK_EmailTemplateType_Users_DeletedBy]
GO

CREATE TABLE [dbo].[EmailTemplate](
	[Id] [uniqueidentifier] NOT NULL,
	[EmailTemplateTypeId] [uniqueidentifier] NULL,
	[EnterpriseId] [uniqueidentifier] NULL,
	[Name] [nvarchar](512) NOT NULL,
	[Subject] [nvarchar](512) NOT NULL,
	[Body] [nvarchar](max) NOT NULL,
	[Placeholder] [nvarchar](max) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_EmailTemplate] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[EmailTemplate] WITH CHECK ADD  CONSTRAINT [FK_EmailTemplate_EmailTemplateType_EmailTemplateTypeId] FOREIGN KEY([EmailTemplateTypeId])
REFERENCES [dbo].[EmailTemplateType] ([Id])
GO

ALTER TABLE [dbo].[EmailTemplate] CHECK CONSTRAINT [FK_EmailTemplate_EmailTemplateType_EmailTemplateTypeId]
GO

ALTER TABLE [dbo].[EmailTemplate] WITH CHECK ADD  CONSTRAINT [FK_EmailTemplate_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[EmailTemplate] CHECK CONSTRAINT [FK_EmailTemplate_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[EmailTemplate] WITH CHECK ADD  CONSTRAINT [FK_EmailTemplate_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EmailTemplate] CHECK CONSTRAINT [FK_EmailTemplate_Users_CreatedBy]
GO

ALTER TABLE [dbo].[EmailTemplate] WITH CHECK ADD  CONSTRAINT [FK_EmailTemplate_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EmailTemplate] CHECK CONSTRAINT [FK_EmailTemplate_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[EmailTemplate] WITH CHECK ADD  CONSTRAINT [FK_EmailTemplate_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[EmailTemplate] CHECK CONSTRAINT [FK_EmailTemplate_Users_DeletedBy]
GO

CREATE TABLE [dbo].[Email](
	[Id] [uniqueidentifier] NOT NULL,
	[EmailStatusId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[EnterpriseId] [uniqueidentifier] NULL,
	[EmailTemplateId] [uniqueidentifier] NULL,
	[Recipient] [nvarchar](512) NULL,
	[Subject] [nvarchar](512) NULL,
	[Body] [nvarchar](max) NULL,
	[SentAt] [datetime] NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Email] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Email] WITH CHECK ADD  CONSTRAINT [FK_Email_EmailStatus_EmailStatusId] FOREIGN KEY([EmailStatusId])
REFERENCES [dbo].[EmailStatus] ([Id])
GO

ALTER TABLE [dbo].[Email] CHECK CONSTRAINT [FK_Email_EmailStatus_EmailStatusId]
GO

ALTER TABLE [dbo].[Email] WITH CHECK ADD  CONSTRAINT [FK_Email_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Email] CHECK CONSTRAINT [FK_Email_Users_UserId]
GO

ALTER TABLE [dbo].[Email] WITH CHECK ADD  CONSTRAINT [FK_Email_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[Email] CHECK CONSTRAINT [FK_Email_Enterprise_EnterpriseId]
GO

ALTER TABLE [dbo].[Email] WITH CHECK ADD  CONSTRAINT [FK_Email_EmailTemplate_EmailTemplateId] FOREIGN KEY([EmailTemplateId])
REFERENCES [dbo].[EmailTemplate] ([Id])
GO

ALTER TABLE [dbo].[Email] CHECK CONSTRAINT [FK_Email_EmailTemplate_EmailTemplateId]
GO

ALTER TABLE [dbo].[Email] WITH CHECK ADD  CONSTRAINT [FK_Email_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Email] CHECK CONSTRAINT [FK_Email_Users_CreatedBy]
GO

ALTER TABLE [dbo].[Email] WITH CHECK ADD  CONSTRAINT [FK_Email_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Email] CHECK CONSTRAINT [FK_Email_Users_ModifiedBy]
GO

ALTER TABLE [dbo].[Email] WITH CHECK ADD  CONSTRAINT [FK_Email_Users_DeletedBy] FOREIGN KEY([DeletedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[Email] CHECK CONSTRAINT [FK_Email_Users_DeletedBy]
GO

CREATE TABLE [dbo].[AuditLog](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[EnterpriseId] [uniqueidentifier] NULL,
	[Entity] [nvarchar](512) NOT NULL,
	[EntityId] [uniqueidentifier] NULL,
	[Details] [nvarchar](max) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NULL DEFAULT NULL,
	[DeletedOn] [datetime] NULL DEFAULT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[ModifiedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[DeletedBy] [uniqueidentifier] NULL DEFAULT NULL,
	[IsDeleted] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_AuditLog] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[AuditLog] WITH CHECK ADD  CONSTRAINT [FK_AuditLog_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[AuditLog] CHECK CONSTRAINT [FK_AuditLog_Users_UserId]
GO

ALTER TABLE [dbo].[AuditLog] WITH CHECK ADD  CONSTRAINT [FK_AuditLog_Enterprise_EnterpriseId] FOREIGN KEY([EnterpriseId])
REFERENCES [dbo].[Enterprise] ([Id])
GO

ALTER TABLE [dbo].[AuditLog] CHECK CONSTRAINT [FK_AuditLog_Enterprise_EnterpriseId]
GO