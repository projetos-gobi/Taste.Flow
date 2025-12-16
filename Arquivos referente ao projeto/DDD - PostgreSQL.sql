CREATE TABLE "AccessProfile" (
  "Id" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_AccessProfile" PRIMARY KEY ("Id")
);

CREATE TABLE "Users" (
  "Id" UUID NOT NULL,
  "AccessProfileId" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "EmailAddress" VARCHAR(512) NULL,
  "Contact" VARCHAR(512) NULL,
  "PasswordHash" VARCHAR(512) NULL,
  "PasswordSalt" VARCHAR(512) NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_AccessProfile_AccessProfileId" FOREIGN KEY ("AccessProfileId") 
REFERENCES "AccessProfile" ("Id");

ALTER TABLE "Users" VALIDATE CONSTRAINT "FK_Users_AccessProfile_AccessProfileId";

CREATE TABLE "UserRefreshToken" (
  "Id" UUID NOT NULL,
  "UserId" UUID NOT NULL,
  "RefreshToken" VARCHAR(512) NOT NULL,
  "ExpirationDate" TIMESTAMP(3) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_UserRefreshToken" PRIMARY KEY ("Id")
);

ALTER TABLE "UserRefreshToken" ADD CONSTRAINT "FK_UserRefreshToken_Users_UserId"
FOREIGN KEY ("UserId") REFERENCES "Users" ("Id");

ALTER TABLE "UserRefreshToken" VALIDATE CONSTRAINT "FK_UserRefreshToken_Users_UserId";

ALTER TABLE "UserRefreshToken" ADD CONSTRAINT "FK_UserRefreshToken_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "UserRefreshToken" VALIDATE CONSTRAINT "FK_UserRefreshToken_Users_CreatedBy";

ALTER TABLE "UserRefreshToken" ADD CONSTRAINT "FK_UserRefreshToken_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "UserRefreshToken" VALIDATE CONSTRAINT "FK_UserRefreshToken_Users_ModifiedBy";

ALTER TABLE "UserRefreshToken" ADD CONSTRAINT "FK_UserRefreshToken_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "UserRefreshToken" VALIDATE CONSTRAINT "FK_UserRefreshToken_Users_DeletedBy";

CREATE TABLE "License" (
  "Id" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "Description" VARCHAR(512) NOT NULL,
  "Value" DECIMAL(18, 2) NULL,
  "Order" INT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_License" PRIMARY KEY ("Id")
);

ALTER TABLE "License" ADD CONSTRAINT "FK_License_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "License" VALIDATE CONSTRAINT "FK_License_Users_CreatedBy";

ALTER TABLE "License" ADD CONSTRAINT "FK_License_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "License" VALIDATE CONSTRAINT "FK_License_Users_ModifiedBy";

ALTER TABLE "License" ADD CONSTRAINT "FK_License_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "License" VALIDATE CONSTRAINT "FK_License_Users_DeletedBy";

CREATE TABLE "Enterprise" (
    "Id" UUID NOT NULL,
    "LicenseId" UUID,
    "MainEnterpriseId" UUID,
    "FantasyName" VARCHAR(512),
    "SocialReason" VARCHAR(512),
    "Cnpj" VARCHAR(512),
    "LicenseQuantity" INTEGER,
	"HasUnlimitedLicenses" BOOLEAN NOT NULL DEFAULT FALSE,
    "IsHeadOffice" BOOLEAN NOT NULL,
	"StateRegistration" VARCHAR(512),
    "MunicipalRegistration" VARCHAR(512),
	"Observation" VARCHAR(2048),
    "CreatedOn" TIMESTAMP NOT NULL,
    "ModifiedOn" TIMESTAMP DEFAULT NULL,
    "DeletedOn" TIMESTAMP DEFAULT NULL,
    "CreatedBy" UUID NOT NULL,
    "ModifiedBy" UUID DEFAULT NULL,
    "DeletedBy" UUID DEFAULT NULL,
    "IsDeleted" BOOLEAN NOT NULL,
    "IsActive" BOOLEAN NOT NULL,
    CONSTRAINT "PK_Enterprise" PRIMARY KEY ("Id")
);


ALTER TABLE "Enterprise" ADD CONSTRAINT "FK_Enterprise_License_LicenseId"
FOREIGN KEY ("LicenseId") REFERENCES "License" ("Id");

ALTER TABLE "Enterprise" VALIDATE CONSTRAINT "FK_Enterprise_License_LicenseId";

ALTER TABLE "Enterprise" ADD CONSTRAINT "FK_Enterprise_Enterprise_MainEnterpriseId"
FOREIGN KEY ("MainEnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "Enterprise" VALIDATE CONSTRAINT "FK_Enterprise_Enterprise_MainEnterpriseId";

ALTER TABLE "Enterprise" ADD CONSTRAINT "FK_Enterprise_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Enterprise" VALIDATE CONSTRAINT "FK_Enterprise_Users_CreatedBy";

ALTER TABLE "Enterprise" ADD CONSTRAINT "FK_Enterprise_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Enterprise" VALIDATE CONSTRAINT "FK_Enterprise_Users_ModifiedBy";

ALTER TABLE "Enterprise" ADD CONSTRAINT "FK_Enterprise_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Enterprise" VALIDATE CONSTRAINT "FK_Enterprise_Users_DeletedBy";

CREATE TABLE "EnterpriseAddress" (
    "Id" UUID NOT NULL,
    "EnterpriseId" UUID,
    "PostalCode" VARCHAR(512),
    "Street" VARCHAR(512),
    "Number" VARCHAR(512),
    "Complement" VARCHAR(512),
    "District" VARCHAR(512),
    "City" VARCHAR(512),
    "State" VARCHAR(512),
    "Latitude" DOUBLE PRECISION,
    "Longitude" DOUBLE PRECISION,
    "CreatedOn" TIMESTAMP NOT NULL,
    "ModifiedOn" TIMESTAMP DEFAULT NULL,
    "DeletedOn" TIMESTAMP DEFAULT NULL,
    "CreatedBy" UUID NOT NULL,
    "ModifiedBy" UUID DEFAULT NULL,
    "DeletedBy" UUID DEFAULT NULL,
    "IsDeleted" BOOLEAN NOT NULL,
    "IsActive" BOOLEAN NOT NULL,
    CONSTRAINT "PK_EnterpriseAddress" PRIMARY KEY ("Id")
);

ALTER TABLE "EnterpriseAddress" ADD CONSTRAINT "FK_EnterpriseAddress_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "EnterpriseAddress" ADD CONSTRAINT "FK_EnterpriseAddress_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "EnterpriseAddress" ADD CONSTRAINT "FK_EnterpriseAddress_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "EnterpriseAddress" ADD CONSTRAINT "FK_EnterpriseAddress_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

CREATE TABLE "EnterpriseContact" (
    "Id" UUID NOT NULL,
    "EnterpriseId" UUID,
    "Telephone" VARCHAR(512),
    "EmailAddress" VARCHAR(512),
    "Responsible" VARCHAR(512),
    "CreatedOn" TIMESTAMP NOT NULL,
    "ModifiedOn" TIMESTAMP DEFAULT NULL,
    "DeletedOn" TIMESTAMP DEFAULT NULL,
    "CreatedBy" UUID NOT NULL,
    "ModifiedBy" UUID DEFAULT NULL,
    "DeletedBy" UUID DEFAULT NULL,
    "IsDeleted" BOOLEAN NOT NULL,
    "IsActive" BOOLEAN NOT NULL,
    CONSTRAINT "PK_EnterpriseContact" PRIMARY KEY ("Id")
);

ALTER TABLE "EnterpriseContact" ADD CONSTRAINT "FK_EnterpriseContact_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "EnterpriseContact" ADD CONSTRAINT "FK_EnterpriseContact_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "EnterpriseContact" ADD CONSTRAINT "FK_EnterpriseContact_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "EnterpriseContact" ADD CONSTRAINT "FK_EnterpriseContact_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");


CREATE TABLE "EnterpriseRelationship" (
  "Id" UUID NOT NULL,
  "MainEnterpriseId" UUID NOT NULL,
  "BranchEnterpriseId" UUID NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_EnterpriseRelationship" PRIMARY KEY ("Id")
);

ALTER TABLE "EnterpriseRelationship" ADD CONSTRAINT "FK_EnterpriseRelationship_Enterprise_MainEnterpriseId"
FOREIGN KEY ("MainEnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "EnterpriseRelationship" VALIDATE CONSTRAINT "FK_EnterpriseRelationship_Enterprise_MainEnterpriseId";

ALTER TABLE "EnterpriseRelationship" ADD CONSTRAINT "FK_EnterpriseRelationship_Enterprise_BranchEnterpriseId"
FOREIGN KEY ("BranchEnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "EnterpriseRelationship" VALIDATE CONSTRAINT "FK_EnterpriseRelationship_Enterprise_BranchEnterpriseId";

ALTER TABLE "EnterpriseRelationship" ADD CONSTRAINT "FK_EnterpriseRelationship_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "EnterpriseRelationship" VALIDATE CONSTRAINT "FK_EnterpriseRelationship_Users_CreatedBy";

ALTER TABLE "EnterpriseRelationship" ADD CONSTRAINT "FK_EnterpriseRelationship_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "EnterpriseRelationship" VALIDATE CONSTRAINT "FK_EnterpriseRelationship_Users_ModifiedBy";

ALTER TABLE "EnterpriseRelationship" ADD CONSTRAINT "FK_EnterpriseRelationship_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "EnterpriseRelationship" VALIDATE CONSTRAINT "FK_EnterpriseRelationship_Users_DeletedBy";

CREATE TABLE "LicenseManagement" (
  "Id" UUID NOT NULL,
  "LicenseId" UUID NULL,
  "EnterpriseId" UUID NULL,
  "LicenseCode" VARCHAR(512),
  "ExpirationDate" TIMESTAMP(3) NOT NULL,
  "IsIndefinite" BOOLEAN NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_LicenseManagement" PRIMARY KEY ("Id")
);

ALTER TABLE "LicenseManagement" ADD CONSTRAINT "FK_LicenseManagement_License_LicenseId"
FOREIGN KEY ("LicenseId") REFERENCES "License" ("Id");

ALTER TABLE "LicenseManagement" VALIDATE CONSTRAINT "FK_LicenseManagement_License_LicenseId";

ALTER TABLE "LicenseManagement" ADD CONSTRAINT "FK_LicenseManagement_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "LicenseManagement" VALIDATE CONSTRAINT "FK_LicenseManagement_Enterprise_EnterpriseId";

ALTER TABLE "LicenseManagement" ADD CONSTRAINT "FK_LicenseManagement_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "LicenseManagement" VALIDATE CONSTRAINT "FK_LicenseManagement_Users_CreatedBy";

ALTER TABLE "LicenseManagement" ADD CONSTRAINT "FK_LicenseManagement_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "LicenseManagement" VALIDATE CONSTRAINT "FK_LicenseManagement_Users_ModifiedBy";

ALTER TABLE "LicenseManagement" ADD CONSTRAINT "FK_LicenseManagement_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "LicenseManagement" VALIDATE CONSTRAINT "FK_LicenseManagement_Users_DeletedBy";

CREATE TABLE "ProfileType" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NULL,
  "Name" VARCHAR(512) NOT NULL,
  "Description" VARCHAR(512) NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_ProfileType" PRIMARY KEY ("Id")
);

ALTER TABLE "ProfileType" ADD CONSTRAINT "FK_ProfileType_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "ProfileType" VALIDATE CONSTRAINT "FK_ProfileType_Enterprise_EnterpriseId";

ALTER TABLE "ProfileType" ADD CONSTRAINT "FK_ProfileType_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProfileType" VALIDATE CONSTRAINT "FK_ProfileType_Users_CreatedBy";

ALTER TABLE "ProfileType" ADD CONSTRAINT "FK_ProfileType_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProfileType" VALIDATE CONSTRAINT "FK_ProfileType_Users_ModifiedBy";

ALTER TABLE "ProfileType" ADD CONSTRAINT "FK_ProfileType_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProfileType" VALIDATE CONSTRAINT "FK_ProfileType_Users_DeletedBy";

CREATE TABLE "UserEnterprise" (
  "Id" UUID NOT NULL,
  "UserId" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "LicenseManagementId" UUID NULL,
  "ProfileTypeId" UUID NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_UserEnterprise" PRIMARY KEY ("Id")
);

ALTER TABLE "UserEnterprise" ADD CONSTRAINT "FK_UserEnterprise_Users_UserId"
FOREIGN KEY ("UserId") REFERENCES "Users" ("Id");

ALTER TABLE "UserEnterprise" VALIDATE CONSTRAINT "FK_UserEnterprise_Users_UserId";

ALTER TABLE "UserEnterprise" ADD CONSTRAINT "FK_UserEnterprise_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "UserEnterprise" VALIDATE CONSTRAINT "FK_UserEnterprise_Enterprise_EnterpriseId";

ALTER TABLE "UserEnterprise" ADD CONSTRAINT "FK_UserEnterprise_LicenseManagement_LicenseManagementId"
FOREIGN KEY ("LicenseManagementId") REFERENCES "LicenseManagement" ("Id");

ALTER TABLE "UserEnterprise" VALIDATE CONSTRAINT "FK_UserEnterprise_LicenseManagement_LicenseManagementId";

ALTER TABLE "UserEnterprise" ADD CONSTRAINT "FK_UserEnterprise_ProfileType_ProfileTypeId"
FOREIGN KEY ("ProfileTypeId") REFERENCES "ProfileType" ("Id");

ALTER TABLE "UserEnterprise" VALIDATE CONSTRAINT "FK_UserEnterprise_ProfileType_ProfileTypeId";

ALTER TABLE "UserEnterprise" ADD CONSTRAINT "FK_UserEnterprise_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "UserEnterprise" VALIDATE CONSTRAINT "FK_UserEnterprise_Users_CreatedBy";

ALTER TABLE "UserEnterprise" ADD CONSTRAINT "FK_UserEnterprise_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "UserEnterprise" VALIDATE CONSTRAINT "FK_UserEnterprise_Users_ModifiedBy";

ALTER TABLE "UserEnterprise" ADD CONSTRAINT "FK_UserEnterprise_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "UserEnterprise" VALIDATE CONSTRAINT "FK_UserEnterprise_Users_DeletedBy";

CREATE TABLE "Unit" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "Value" DECIMAL(18,4) NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_Unit" PRIMARY KEY ("Id")
);

ALTER TABLE "Unit" ADD CONSTRAINT "FK_Unit_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "Unit" VALIDATE CONSTRAINT "FK_Unit_Enterprise_EnterpriseId";

ALTER TABLE "Unit" ADD CONSTRAINT "FK_Unit_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Unit" VALIDATE CONSTRAINT "FK_Unit_Users_CreatedBy";

ALTER TABLE "Unit" ADD CONSTRAINT "FK_Unit_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Unit" VALIDATE CONSTRAINT "FK_Unit_Users_ModifiedBy";

ALTER TABLE "Unit" ADD CONSTRAINT "FK_Unit_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Unit" VALIDATE CONSTRAINT "FK_Unit_Users_DeletedBy";

CREATE TABLE "Item" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_Item" PRIMARY KEY ("Id")
);

ALTER TABLE "Item" ADD CONSTRAINT "FK_Item_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "Item" VALIDATE CONSTRAINT "FK_Item_Enterprise_EnterpriseId";

ALTER TABLE "Item" ADD CONSTRAINT "FK_Item_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Item" VALIDATE CONSTRAINT "FK_Item_Users_CreatedBy";

ALTER TABLE "Item" ADD CONSTRAINT "FK_Item_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Item" VALIDATE CONSTRAINT "FK_Item_Users_ModifiedBy";

ALTER TABLE "Item" ADD CONSTRAINT "FK_Item_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Item" VALIDATE CONSTRAINT "FK_Item_Users_DeletedBy";

CREATE TABLE "ProductType" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_ProductType" PRIMARY KEY ("Id")
);

ALTER TABLE "ProductType" ADD CONSTRAINT "FK_ProductType_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "ProductType" VALIDATE CONSTRAINT "FK_ProductType_Enterprise_EnterpriseId";

ALTER TABLE "ProductType" ADD CONSTRAINT "FK_ProductType_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductType" VALIDATE CONSTRAINT "FK_ProductType_Users_CreatedBy";

ALTER TABLE "ProductType" ADD CONSTRAINT "FK_ProductType_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductType" VALIDATE CONSTRAINT "FK_ProductType_Users_ModifiedBy";

ALTER TABLE "ProductType" ADD CONSTRAINT "FK_ProductType_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductType" VALIDATE CONSTRAINT "FK_ProductType_Users_DeletedBy";

CREATE TABLE "Brand" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_Brand" PRIMARY KEY ("Id")
);

ALTER TABLE "Brand" ADD CONSTRAINT "FK_Brand_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "Brand" VALIDATE CONSTRAINT "FK_Brand_Enterprise_EnterpriseId";

ALTER TABLE "Brand" ADD CONSTRAINT "FK_Brand_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Brand" VALIDATE CONSTRAINT "FK_Brand_Users_CreatedBy";

ALTER TABLE "Brand" ADD CONSTRAINT "FK_Brand_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Brand" VALIDATE CONSTRAINT "FK_Brand_Users_ModifiedBy";

ALTER TABLE "Brand" ADD CONSTRAINT "FK_Brand_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Brand" VALIDATE CONSTRAINT "FK_Brand_Users_DeletedBy";

CREATE TABLE "CategoryType" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_CategoryType" PRIMARY KEY ("Id")
);

ALTER TABLE "CategoryType" ADD CONSTRAINT "FK_CategoryType_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "CategoryType" VALIDATE CONSTRAINT "FK_CategoryType_Enterprise_EnterpriseId";

ALTER TABLE "CategoryType" ADD CONSTRAINT "FK_CategoryType_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "CategoryType" VALIDATE CONSTRAINT "FK_CategoryType_Users_CreatedBy";

ALTER TABLE "CategoryType" ADD CONSTRAINT "FK_CategoryType_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "CategoryType" VALIDATE CONSTRAINT "FK_CategoryType_Users_ModifiedBy";

ALTER TABLE "CategoryType" ADD CONSTRAINT "FK_CategoryType_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "CategoryType" VALIDATE CONSTRAINT "FK_CategoryType_Users_DeletedBy";

CREATE TABLE "Category" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "CategoryTypeId" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_Category" PRIMARY KEY ("Id")
);

ALTER TABLE "Category" ADD CONSTRAINT "FK_Category_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "Category" VALIDATE CONSTRAINT "FK_Category_Enterprise_EnterpriseId";

ALTER TABLE "Category" ADD CONSTRAINT "FK_Category_CategoryType_EnterpriseId"
FOREIGN KEY ("CategoryTypeId") REFERENCES "CategoryType" ("Id");

ALTER TABLE "Category" VALIDATE CONSTRAINT "FK_Category_CategoryType_EnterpriseId";

ALTER TABLE "Category" ADD CONSTRAINT "FK_Category_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Category" VALIDATE CONSTRAINT "FK_Category_Users_CreatedBy";

ALTER TABLE "Category" ADD CONSTRAINT "FK_Category_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Category" VALIDATE CONSTRAINT "FK_Category_Users_ModifiedBy";

ALTER TABLE "Category" ADD CONSTRAINT "FK_Category_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Category" VALIDATE CONSTRAINT "FK_Category_Users_DeletedBy";

CREATE TABLE "SubCategory" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_SubCategory" PRIMARY KEY ("Id")
);

ALTER TABLE "SubCategory" ADD CONSTRAINT "FK_SubCategory_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "SubCategory" VALIDATE CONSTRAINT "FK_SubCategory_Enterprise_EnterpriseId";

ALTER TABLE "SubCategory" ADD CONSTRAINT "FK_SubCategory_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "SubCategory" VALIDATE CONSTRAINT "FK_SubCategory_Users_CreatedBy";

ALTER TABLE "SubCategory" ADD CONSTRAINT "FK_SubCategory_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "SubCategory" VALIDATE CONSTRAINT "FK_SubCategory_Users_ModifiedBy";

ALTER TABLE "SubCategory" ADD CONSTRAINT "FK_SubCategory_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "SubCategory" VALIDATE CONSTRAINT "FK_SubCategory_Users_DeletedBy";

CREATE TABLE "PaymentType" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NULL,
  "Name" VARCHAR(512) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_PaymentType" PRIMARY KEY ("Id")
);

ALTER TABLE "PaymentType" ADD CONSTRAINT "FK_PaymentType_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "PaymentType" VALIDATE CONSTRAINT "FK_PaymentType_Enterprise_EnterpriseId";

ALTER TABLE "PaymentType" ADD CONSTRAINT "FK_PaymentType_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "PaymentType" VALIDATE CONSTRAINT "FK_PaymentType_Users_CreatedBy";

ALTER TABLE "PaymentType" ADD CONSTRAINT "FK_PaymentType_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "PaymentType" VALIDATE CONSTRAINT "FK_PaymentType_Users_ModifiedBy";

ALTER TABLE "PaymentType" ADD CONSTRAINT "FK_PaymentType_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "PaymentType" VALIDATE CONSTRAINT "FK_PaymentType_Users_DeletedBy";

CREATE TABLE "Supplier" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "PaymentTypeId" UUID NOT NULL,
  "CategoryId" UUID NOT NULL,
  "SubCategoryId" UUID NOT NULL,
  "FantasyName" VARCHAR(512) NULL,
  "SocialReason" VARCHAR(512) NULL,
  "Cnpj" VARCHAR(512) NULL,
  "Telephone" VARCHAR(512) NULL,
  "Address" VARCHAR(512) NULL,
  "Latitude" FLOAT NULL,
  "Longitude" FLOAT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_Supplier" PRIMARY KEY ("Id")
);

ALTER TABLE "Supplier" ADD CONSTRAINT "FK_Supplier_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "Supplier" VALIDATE CONSTRAINT "FK_Supplier_Enterprise_EnterpriseId";

ALTER TABLE "Supplier" ADD CONSTRAINT "FK_Supplier_PaymentType_PaymentTypeId"
FOREIGN KEY ("PaymentTypeId") REFERENCES "PaymentType" ("Id");

ALTER TABLE "Supplier" VALIDATE CONSTRAINT "FK_Supplier_PaymentType_PaymentTypeId";

ALTER TABLE "Supplier" ADD CONSTRAINT "FK_Supplier_Category_CategoryId"
FOREIGN KEY ("CategoryId") REFERENCES "Category" ("Id");

ALTER TABLE "Supplier" VALIDATE CONSTRAINT "FK_Supplier_Category_CategoryId";

ALTER TABLE "Supplier" ADD CONSTRAINT "FK_Supplier_SubCategory_SubCategoryId"
FOREIGN KEY ("SubCategoryId") REFERENCES "SubCategory" ("Id");

ALTER TABLE "Supplier" VALIDATE CONSTRAINT "FK_Supplier_SubCategory_SubCategoryId";

ALTER TABLE "Supplier" ADD CONSTRAINT "FK_Supplier_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Supplier" VALIDATE CONSTRAINT "FK_Supplier_Users_CreatedBy";

ALTER TABLE "Supplier" ADD CONSTRAINT "FK_Supplier_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Supplier" VALIDATE CONSTRAINT "FK_Supplier_Users_ModifiedBy";

ALTER TABLE "Supplier" ADD CONSTRAINT "FK_Supplier_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Supplier" VALIDATE CONSTRAINT "FK_Supplier_Users_DeletedBy";

CREATE TABLE "Merchandise" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "ItemId" UUID NOT NULL,
  "BrandId" UUID NOT NULL,
  "ProductTypeId" UUID NULL,
  "CategoryId" UUID NOT NULL,
  "UnitId" UUID NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_Merchandise" PRIMARY KEY ("Id")
);

ALTER TABLE "Merchandise" ADD CONSTRAINT "FK_Merchandise_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "Merchandise" VALIDATE CONSTRAINT "FK_Merchandise_Enterprise_EnterpriseId";

ALTER TABLE "Merchandise" ADD CONSTRAINT "FK_Merchandise_Item_ItemId"
FOREIGN KEY ("ItemId") REFERENCES "Item" ("Id");

ALTER TABLE "Merchandise" VALIDATE CONSTRAINT "FK_Merchandise_Item_ItemId";

ALTER TABLE "Merchandise" ADD CONSTRAINT "FK_Merchandise_Brand_BrandId"
FOREIGN KEY ("BrandId") REFERENCES "Brand" ("Id");

ALTER TABLE "Merchandise" VALIDATE CONSTRAINT "FK_Merchandise_Brand_BrandId";

ALTER TABLE "Merchandise" ADD CONSTRAINT "FK_Merchandise_ProductType_ProductTypeId"
FOREIGN KEY ("ProductTypeId") REFERENCES "ProductType" ("Id");

ALTER TABLE "Merchandise" VALIDATE CONSTRAINT "FK_Merchandise_ProductType_ProductTypeId";

ALTER TABLE "Merchandise" ADD CONSTRAINT "FK_Merchandise_Category_CategoryId"
FOREIGN KEY ("CategoryId") REFERENCES "Category" ("Id");

ALTER TABLE "Merchandise" VALIDATE CONSTRAINT "FK_Merchandise_Category_CategoryId";

ALTER TABLE "Merchandise" ADD CONSTRAINT "FK_Merchandise_Unit_UnitId"
FOREIGN KEY ("UnitId") REFERENCES "Unit" ("Id");

ALTER TABLE "Merchandise" VALIDATE CONSTRAINT "FK_Merchandise_Unit_UnitId";

ALTER TABLE "Merchandise" ADD CONSTRAINT "FK_Merchandise_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Merchandise" VALIDATE CONSTRAINT "FK_Merchandise_Users_CreatedBy";

ALTER TABLE "Merchandise" ADD CONSTRAINT "FK_Merchandise_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Merchandise" VALIDATE CONSTRAINT "FK_Merchandise_Users_ModifiedBy";

ALTER TABLE "Merchandise" ADD CONSTRAINT "FK_Merchandise_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Merchandise" VALIDATE CONSTRAINT "FK_Merchandise_Users_DeletedBy";

CREATE TABLE "ProductIntermediate" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "CategoryId" UUID NULL,
  "SubCategoryId" UUID NULL,
  "Name" VARCHAR(512) NOT NULL,
  "Price" DECIMAL(18,0) NULL,
  "Yield" INT NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_ProductIntermediate" PRIMARY KEY ("Id")
);

ALTER TABLE "ProductIntermediate" ADD CONSTRAINT "FK_ProductIntermediate_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "ProductIntermediate" VALIDATE CONSTRAINT "FK_ProductIntermediate_Enterprise_EnterpriseId";

ALTER TABLE "ProductIntermediate" ADD CONSTRAINT "FK_ProductIntermediate_Category_CategoryId"
FOREIGN KEY ("CategoryId") REFERENCES "Category" ("Id");

ALTER TABLE "ProductIntermediate" VALIDATE CONSTRAINT "FK_ProductIntermediate_Category_CategoryId";

ALTER TABLE "ProductIntermediate" ADD CONSTRAINT "FK_ProductIntermediate_SubCategory_SubCategoryId"
FOREIGN KEY ("SubCategoryId") REFERENCES "SubCategory" ("Id");

ALTER TABLE "ProductIntermediate" VALIDATE CONSTRAINT "FK_ProductIntermediate_SubCategory_SubCategoryId";

ALTER TABLE "ProductIntermediate" ADD CONSTRAINT "FK_ProductIntermediate_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductIntermediate" VALIDATE CONSTRAINT "FK_ProductIntermediate_Users_CreatedBy";

ALTER TABLE "ProductIntermediate" ADD CONSTRAINT "FK_ProductIntermediate_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductIntermediate" VALIDATE CONSTRAINT "FK_ProductIntermediate_Users_ModifiedBy";

ALTER TABLE "ProductIntermediate" ADD CONSTRAINT "FK_ProductIntermediate_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductIntermediate" VALIDATE CONSTRAINT "FK_ProductIntermediate_Users_DeletedBy";

CREATE TABLE "ProductIntermediateComposition" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "ProductIntermediateId" UUID NOT NULL,
  "MerchandiseId" UUID NULL,
  "UnitId" UUID NOT NULL,
  "Quantity" DECIMAL(18,4) NOT NULL,
  "Yield" DECIMAL(5,2) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_ProductIntermediateComposition" PRIMARY KEY ("Id")
);

ALTER TABLE "ProductIntermediateComposition" ADD CONSTRAINT "FK_ProductIntermediateComposition_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "ProductIntermediateComposition" VALIDATE CONSTRAINT "FK_ProductIntermediateComposition_Enterprise_EnterpriseId";

ALTER TABLE "ProductIntermediateComposition" ADD CONSTRAINT "FK_ProductIntermediateComposition_ProductIntermediate_ProductIntermediateId"
FOREIGN KEY ("ProductIntermediateId") REFERENCES "ProductIntermediate" ("Id");

ALTER TABLE "ProductIntermediateComposition" VALIDATE CONSTRAINT "FK_ProductIntermediateComposition_ProductIntermediate_ProductIntermediateId";

ALTER TABLE "ProductIntermediateComposition" ADD CONSTRAINT "FK_ProductIntermediateComposition_Merchandise_MerchandiseId"
FOREIGN KEY ("MerchandiseId") REFERENCES "Merchandise" ("Id");

ALTER TABLE "ProductIntermediateComposition" VALIDATE CONSTRAINT "FK_ProductIntermediateComposition_Merchandise_MerchandiseId";

ALTER TABLE "ProductIntermediateComposition" ADD CONSTRAINT "FK_ProductIntermediateComposition_Unit_UnitId"
FOREIGN KEY ("UnitId") REFERENCES "Unit" ("Id");

ALTER TABLE "ProductIntermediateComposition" VALIDATE CONSTRAINT "FK_ProductIntermediateComposition_Unit_UnitId";

ALTER TABLE "ProductIntermediateComposition" ADD CONSTRAINT "FK_ProductIntermediateComposition_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductIntermediateComposition" VALIDATE CONSTRAINT "FK_ProductIntermediateComposition_Users_CreatedBy";

ALTER TABLE "ProductIntermediateComposition" ADD CONSTRAINT "FK_ProductIntermediateComposition_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductIntermediateComposition" VALIDATE CONSTRAINT "FK_ProductIntermediateComposition_Users_ModifiedBy";

ALTER TABLE "ProductIntermediateComposition" ADD CONSTRAINT "FK_ProductIntermediateComposition_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductIntermediateComposition" VALIDATE CONSTRAINT "FK_ProductIntermediateComposition_Users_DeletedBy";

CREATE TABLE "Product" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "CategoryId" UUID NOT NULL,
  "SubCategoryId" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "Price" DECIMAL(18,0) NULL,
  "Yield" INT NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_Product" PRIMARY KEY ("Id")
);

ALTER TABLE "Product" ADD CONSTRAINT "FK_Product_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "Product" VALIDATE CONSTRAINT "FK_Product_Enterprise_EnterpriseId";

ALTER TABLE "Product" ADD CONSTRAINT "FK_Product_Category_CategoryId"
FOREIGN KEY ("CategoryId") REFERENCES "Category" ("Id");

ALTER TABLE "Product" VALIDATE CONSTRAINT "FK_Product_Category_CategoryId";

ALTER TABLE "Product" ADD CONSTRAINT "FK_Product_SubCategory_SubCategoryId"
FOREIGN KEY ("SubCategoryId") REFERENCES "SubCategory" ("Id");

ALTER TABLE "Product" VALIDATE CONSTRAINT "FK_Product_SubCategory_SubCategoryId";

ALTER TABLE "Product" ADD CONSTRAINT "FK_Product_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Product" VALIDATE CONSTRAINT "FK_Product_Users_CreatedBy";

ALTER TABLE "Product" ADD CONSTRAINT "FK_Product_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Product" VALIDATE CONSTRAINT "FK_Product_Users_ModifiedBy";

ALTER TABLE "Product" ADD CONSTRAINT "FK_Product_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "Product" VALIDATE CONSTRAINT "FK_Product_Users_DeletedBy";

CREATE TABLE "ProductComposition" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "ProductId" UUID NOT NULL,
  "MerchandiseId" UUID NULL,
  "ProductIntermediateId" UUID NULL,
  "UnitId" UUID NOT NULL,
  "Quantity" DECIMAL(18,4) NOT NULL,
  "Yield" DECIMAL(5,2) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_ProductComposition" PRIMARY KEY ("Id")
);

ALTER TABLE "ProductComposition" ADD CONSTRAINT "FK_ProductComposition_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "ProductComposition" VALIDATE CONSTRAINT "FK_ProductComposition_Enterprise_EnterpriseId";

ALTER TABLE "ProductComposition" ADD CONSTRAINT "FK_ProductComposition_Product_ProductId"
FOREIGN KEY ("ProductId") REFERENCES "Product" ("Id");

ALTER TABLE "ProductComposition" VALIDATE CONSTRAINT "FK_ProductComposition_Product_ProductId";

ALTER TABLE "ProductComposition" ADD CONSTRAINT "FK_ProductComposition_Merchandise_MerchandiseId"
FOREIGN KEY ("MerchandiseId") REFERENCES "Merchandise" ("Id");

ALTER TABLE "ProductComposition" VALIDATE CONSTRAINT "FK_ProductComposition_Merchandise_MerchandiseId";

ALTER TABLE "ProductComposition" ADD CONSTRAINT "FK_ProductComposition_ProductIntermediate_ProductIntermediateId"
FOREIGN KEY ("ProductIntermediateId") REFERENCES "ProductIntermediate" ("Id");

ALTER TABLE "ProductComposition" VALIDATE CONSTRAINT "FK_ProductComposition_ProductIntermediate_ProductIntermediateId";

ALTER TABLE "ProductComposition" ADD CONSTRAINT "FK_ProductComposition_Unit_UnitId"
FOREIGN KEY ("UnitId") REFERENCES "Unit" ("Id");

ALTER TABLE "ProductComposition" VALIDATE CONSTRAINT "FK_ProductComposition_Unit_UnitId";

ALTER TABLE "ProductComposition" ADD CONSTRAINT "FK_ProductComposition_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductComposition" VALIDATE CONSTRAINT "FK_ProductComposition_Users_CreatedBy";

ALTER TABLE "ProductComposition" ADD CONSTRAINT "FK_ProductComposition_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductComposition" VALIDATE CONSTRAINT "FK_ProductComposition_Users_ModifiedBy";

ALTER TABLE "ProductComposition" ADD CONSTRAINT "FK_ProductComposition_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "ProductComposition" VALIDATE CONSTRAINT "FK_ProductComposition_Users_DeletedBy";

CREATE TABLE "StockEntry" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "SupplierId" UUID NOT NULL,
  "PurchaseDate" TIMESTAMP(3) NULL,
  "ExpectedDeliveryDate" TIMESTAMP(3) NULL,
  "ReceivedBy" VARCHAR(512) NOT NULL,
  "InvoiceNumber" VARCHAR(512) NULL,
  "TotalAmount" DECIMAL(18,2) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_StockEntry" PRIMARY KEY ("Id")
);

ALTER TABLE "StockEntry" ADD CONSTRAINT "FK_StockEntry_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "StockEntry" VALIDATE CONSTRAINT "FK_StockEntry_Enterprise_EnterpriseId";

ALTER TABLE "StockEntry" ADD CONSTRAINT "FK_StockEntry_Supplier_SupplierId"
FOREIGN KEY ("SupplierId") REFERENCES "Supplier" ("Id");

ALTER TABLE "StockEntry" VALIDATE CONSTRAINT "FK_StockEntry_Supplier_SupplierId";

ALTER TABLE "StockEntry" ADD CONSTRAINT "FK_StockEntry_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "StockEntry" VALIDATE CONSTRAINT "FK_StockEntry_Users_CreatedBy";

ALTER TABLE "StockEntry" ADD CONSTRAINT "FK_StockEntry_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "StockEntry" VALIDATE CONSTRAINT "FK_StockEntry_Users_ModifiedBy";

ALTER TABLE "StockEntry" ADD CONSTRAINT "FK_StockEntry_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "StockEntry" VALIDATE CONSTRAINT "FK_StockEntry_Users_DeletedBy";

CREATE TABLE "StockEntryItem" (
  "Id" UUID NOT NULL,
  "EnterpriseId" UUID NOT NULL,
  "StockEntryId" UUID NOT NULL,
  "UnitId" UUID NOT NULL,
  "Quantity" DECIMAL(18,4) NOT NULL,
  "TotalAmount" DECIMAL(18,2) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_StockEntryItem" PRIMARY KEY ("Id")
);

ALTER TABLE "StockEntryItem" ADD CONSTRAINT "FK_StockEntryItem_Enterprise_EnterpriseId"
FOREIGN KEY ("EnterpriseId") REFERENCES "Enterprise" ("Id");

ALTER TABLE "StockEntryItem" VALIDATE CONSTRAINT "FK_StockEntryItem_Enterprise_EnterpriseId";

ALTER TABLE "StockEntryItem" ADD CONSTRAINT "FK_StockEntryItem_StockEntry_StockEntryId"
FOREIGN KEY ("StockEntryId") REFERENCES "StockEntry" ("Id");

ALTER TABLE "StockEntryItem" VALIDATE CONSTRAINT "FK_StockEntryItem_StockEntry_StockEntryId";

ALTER TABLE "StockEntryItem" ADD CONSTRAINT "FK_StockEntryItem_Unit_UnitId"
FOREIGN KEY ("UnitId") REFERENCES "Unit" ("Id");

ALTER TABLE "StockEntryItem" VALIDATE CONSTRAINT "FK_StockEntryItem_Unit_UnitId";

ALTER TABLE "StockEntryItem" ADD CONSTRAINT "FK_StockEntryItem_Users_CreatedBy"
FOREIGN KEY ("CreatedBy") REFERENCES "Users" ("Id");

ALTER TABLE "StockEntryItem" VALIDATE CONSTRAINT "FK_StockEntryItem_Users_CreatedBy";

ALTER TABLE "StockEntryItem" ADD CONSTRAINT "FK_StockEntryItem_Users_ModifiedBy"
FOREIGN KEY ("ModifiedBy") REFERENCES "Users" ("Id");

ALTER TABLE "StockEntryItem" VALIDATE CONSTRAINT "FK_StockEntryItem_Users_ModifiedBy";

ALTER TABLE "StockEntryItem" ADD CONSTRAINT "FK_StockEntryItem_Users_DeletedBy"
FOREIGN KEY ("DeletedBy") REFERENCES "Users" ("Id");

ALTER TABLE "StockEntryItem" VALIDATE CONSTRAINT "FK_StockEntryItem_Users_DeletedBy";

CREATE TABLE "EmailStatus" (
  "Id" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_EmailStatus" PRIMARY KEY ("Id")
);

ALTER TABLE "EmailStatus" ADD CONSTRAINT "FK_EmailStatus_Users_CreatedBy" FOREIGN KEY ("CreatedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "EmailStatus" VALIDATE CONSTRAINT "FK_EmailStatus_Users_CreatedBy";

ALTER TABLE "EmailStatus" ADD CONSTRAINT "FK_EmailStatus_Users_ModifiedBy" FOREIGN KEY ("ModifiedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "EmailStatus" VALIDATE CONSTRAINT "FK_EmailStatus_Users_ModifiedBy";

ALTER TABLE "EmailStatus" ADD CONSTRAINT "FK_EmailStatus_Users_DeletedBy" FOREIGN KEY ("DeletedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "EmailStatus" VALIDATE CONSTRAINT "FK_EmailStatus_Users_DeletedBy";

CREATE TABLE "EmailTemplateType" (
  "Id" UUID NOT NULL,
  "Name" VARCHAR(512) NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_EmailTemplateType" PRIMARY KEY ("Id")
);

ALTER TABLE "EmailTemplateType" ADD CONSTRAINT "FK_EmailTemplateType_Users_CreatedBy" FOREIGN KEY ("CreatedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "EmailTemplateType" VALIDATE CONSTRAINT "FK_EmailTemplateType_Users_CreatedBy";

ALTER TABLE "EmailTemplateType" ADD CONSTRAINT "FK_EmailTemplateType_Users_ModifiedBy" FOREIGN KEY ("ModifiedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "EmailTemplateType" VALIDATE CONSTRAINT "FK_EmailTemplateType_Users_ModifiedBy";

ALTER TABLE "EmailTemplateType" ADD CONSTRAINT "FK_EmailTemplateType_Users_DeletedBy" FOREIGN KEY ("DeletedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "EmailTemplateType" VALIDATE CONSTRAINT "FK_EmailTemplateType_Users_DeletedBy";

CREATE TABLE "EmailTemplate" (
  "Id" UUID NOT NULL,
  "EmailTemplateTypeId" UUID NULL,
  "EnterpriseId" UUID NULL,
  "Name" VARCHAR(512) NOT NULL,
  "Subject" VARCHAR(512) NOT NULL,
  "Body" TEXT NOT NULL,
  "Placeholder" TEXT NOT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_EmailTemplate" PRIMARY KEY ("Id")
);

ALTER TABLE "EmailTemplate" ADD CONSTRAINT "FK_EmailTemplate_EmailTemplateType_EmailTemplateTypeId" FOREIGN KEY ("EmailTemplateTypeId")
REFERENCES "EmailTemplateType" ("Id");

ALTER TABLE "EmailTemplate" VALIDATE CONSTRAINT "FK_EmailTemplate_EmailTemplateType_EmailTemplateTypeId";

ALTER TABLE "EmailTemplate" ADD CONSTRAINT "FK_EmailTemplate_Enterprise_EnterpriseId" FOREIGN KEY ("EnterpriseId")
REFERENCES "Enterprise" ("Id");

ALTER TABLE "EmailTemplate" VALIDATE CONSTRAINT "FK_EmailTemplate_Enterprise_EnterpriseId";

ALTER TABLE "EmailTemplate" ADD CONSTRAINT "FK_EmailTemplate_Users_CreatedBy" FOREIGN KEY ("CreatedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "EmailTemplate" VALIDATE CONSTRAINT "FK_EmailTemplate_Users_CreatedBy";

ALTER TABLE "EmailTemplate" ADD CONSTRAINT "FK_EmailTemplate_Users_ModifiedBy" FOREIGN KEY ("ModifiedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "EmailTemplate" VALIDATE CONSTRAINT "FK_EmailTemplate_Users_ModifiedBy";

ALTER TABLE "EmailTemplate" ADD CONSTRAINT "FK_EmailTemplate_Users_DeletedBy" FOREIGN KEY ("DeletedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "EmailTemplate" VALIDATE CONSTRAINT "FK_EmailTemplate_Users_DeletedBy";


CREATE TABLE "Email" (
  "Id" UUID NOT NULL,
  "EmailStatusId" UUID NOT NULL,
  "UserId" UUID NULL,
  "EnterpriseId" UUID NULL,
  "EmailTemplateId" UUID NULL,
  "Recipient" VARCHAR(512) NULL,
  "Subject" VARCHAR(512) NULL,
  "Body" TEXT NULL,
  "SentAt" TIMESTAMP(3) NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_Email" PRIMARY KEY ("Id")
);

ALTER TABLE "Email" ADD CONSTRAINT "FK_Email_EmailStatus_EmailStatusId" FOREIGN KEY ("EmailStatusId")
REFERENCES "EmailStatus" ("Id");

ALTER TABLE "Email" VALIDATE CONSTRAINT "FK_Email_EmailStatus_EmailStatusId";

ALTER TABLE "Email" ADD CONSTRAINT "FK_Email_Users_UserId" FOREIGN KEY ("UserId")
REFERENCES "Users" ("Id");

ALTER TABLE "Email" VALIDATE CONSTRAINT "FK_Email_Users_UserId";

ALTER TABLE "Email" ADD CONSTRAINT "FK_Email_Enterprise_EnterpriseId" FOREIGN KEY ("EnterpriseId")
REFERENCES "Enterprise" ("Id");

ALTER TABLE "Email" VALIDATE CONSTRAINT "FK_Email_Enterprise_EnterpriseId";

ALTER TABLE "Email" ADD CONSTRAINT "FK_Email_EmailTemplate_EmailTemplateId" FOREIGN KEY ("EmailTemplateId")
REFERENCES "EmailTemplate" ("Id");

ALTER TABLE "Email" VALIDATE CONSTRAINT "FK_Email_EmailTemplate_EmailTemplateId";

ALTER TABLE "Email" ADD CONSTRAINT "FK_Email_Users_CreatedBy" FOREIGN KEY ("CreatedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "Email" VALIDATE CONSTRAINT "FK_Email_Users_CreatedBy";

ALTER TABLE "Email" ADD CONSTRAINT "FK_Email_Users_ModifiedBy" FOREIGN KEY ("ModifiedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "Email" VALIDATE CONSTRAINT "FK_Email_Users_ModifiedBy";

ALTER TABLE "Email" ADD CONSTRAINT "FK_Email_Users_DeletedBy" FOREIGN KEY ("DeletedBy")
REFERENCES "Users" ("Id");

ALTER TABLE "Email" VALIDATE CONSTRAINT "FK_Email_Users_DeletedBy";

CREATE TABLE "AuditLog" (
  "Id" UUID NOT NULL,
  "UserId" UUID NULL,
  "EnterpriseId" UUID NULL,
  "Entity" VARCHAR(512) NOT NULL,
  "EntityId" UUID NULL,
  "Details" TEXT NULL,
  "CreatedOn" TIMESTAMP(3) NOT NULL,
  "ModifiedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "DeletedOn" TIMESTAMP(3) NULL DEFAULT NULL,
  "CreatedBy" UUID NOT NULL,
  "ModifiedBy" UUID NULL DEFAULT NULL,
  "DeletedBy" UUID NULL DEFAULT NULL,
  "IsDeleted" BOOLEAN NOT NULL,
  "IsActive" BOOLEAN NOT NULL,
  CONSTRAINT "PK_AuditLog" PRIMARY KEY ("Id")
);

ALTER TABLE "AuditLog" ADD CONSTRAINT "FK_AuditLog_Users_UserId" FOREIGN KEY ("UserId")
REFERENCES "Users" ("Id");

ALTER TABLE "AuditLog" VALIDATE CONSTRAINT "FK_AuditLog_Users_UserId";

ALTER TABLE "AuditLog" ADD CONSTRAINT "FK_AuditLog_Enterprise_EnterpriseId" FOREIGN KEY ("EnterpriseId")
REFERENCES "Enterprise" ("Id");

ALTER TABLE "AuditLog" VALIDATE CONSTRAINT "FK_AuditLog_Enterprise_EnterpriseId";
