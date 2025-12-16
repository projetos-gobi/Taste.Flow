using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Authentication.Responses;
using TasteFlow.Application.Brand.Responses;
using TasteFlow.Application.Category.Responses;
using TasteFlow.Application.CategoryType.Responses;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.Enterprise.Responses;
using TasteFlow.Application.Item.Responses;
using TasteFlow.Application.Merchandise.Responses;
using TasteFlow.Application.PaymentTerm.Responses;
using TasteFlow.Application.PaymentType.Responses;
using TasteFlow.Application.Product.Responses;
using TasteFlow.Application.ProductComposition.Responses;
using TasteFlow.Application.ProductIntermediate.Responses;
using TasteFlow.Application.ProductIntermediateComposition.Responses;
using TasteFlow.Application.ProductType.Responses;
using TasteFlow.Application.StockEntry.Responses;
using TasteFlow.Application.StockEntryAttachment.Responses;
using TasteFlow.Application.StockEntryItem.Responses;
using TasteFlow.Application.SubCategory.Responses;
using TasteFlow.Application.Supplier.Responses;
using TasteFlow.Application.SupplierPaymentDetail.Responses;
using TasteFlow.Application.SupplierPaymentType.Responses;
using TasteFlow.Application.Unit.Responses;
using TasteFlow.Application.Users.Responses;
using TasteFlow.Domain.Entities;

namespace TasteFlow.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AccessProfile, AccessProfileDTO>().ReverseMap();

            CreateMap<Domain.Entities.Brand, BrandDTO>().ReverseMap();

            CreateMap<Domain.Entities.Category, CategoryDTO>().ReverseMap();

            CreateMap<Domain.Entities.CategoryType, CategoryTypeDTO>().ReverseMap();

            CreateMap<Email, EmailDTO>().ReverseMap();

            CreateMap<EmailStatus, EmailStatusDTO>().ReverseMap();

            CreateMap<EmailTemplate, EmailTemplateDTO>().ReverseMap();

            CreateMap<EmailTemplateType, EmailTemplateTypeDTO>().ReverseMap();

            CreateMap<Domain.Entities.Enterprise, EnterpriseDTO>().ReverseMap();

            CreateMap<Domain.Entities.EnterpriseAddress, EnterpriseAddressDTO>().ReverseMap();

            CreateMap<Domain.Entities.EnterpriseContact, EnterpriseContactDTO>().ReverseMap();

            CreateMap<Domain.Entities.EnterpriseRelationship, EnterpriseRelationshipDTO>().ReverseMap();

            CreateMap<Domain.Entities.Item, ItemDTO>().ReverseMap();

            CreateMap<Domain.Entities.License, LicenseDTO>().ReverseMap();

            CreateMap<Domain.Entities.LicenseManagement, LicenseManagementDTO>().ReverseMap();

            CreateMap<Domain.Entities.Merchandise, MerchandiseDTO>().ReverseMap();

            CreateMap<Domain.Entities.PaymentType, PaymentTypeDTO>().ReverseMap();

            CreateMap<Domain.Entities.Product, ProductDTO>().ReverseMap();

            CreateMap<Domain.Entities.ProductComposition, ProductCompositionDTO>().ReverseMap();

            CreateMap<Domain.Entities.ProductIntermediate, ProductIntermediateDTO>().ReverseMap();

            CreateMap<Domain.Entities.ProductIntermediateComposition, ProductIntermediateCompositionDTO>().ReverseMap();

            CreateMap<Domain.Entities.ProductType, ProductTypeDTO>().ReverseMap();

            CreateMap<ProfileType, ProfileTypeDTO>().ReverseMap();

            CreateMap<Domain.Entities.StockEntry, StockEntryDTO>().ReverseMap();

            CreateMap<Domain.Entities.StockEntryItem, StockEntryItemDTO>().ReverseMap();

            CreateMap<Domain.Entities.SubCategory, SubCategoryDTO>().ReverseMap();

            CreateMap<Domain.Entities.Supplier, SupplierDTO>().ReverseMap();

            CreateMap<Domain.Entities.Unit, UnitDTO>().ReverseMap();

            CreateMap<UserEnterprise, UserEnterpriseDTO>().ReverseMap();

            CreateMap<UserRefreshToken, UserRefreshTokenDTO>().ReverseMap();

            CreateMap<Domain.Entities.Users, UsersDTO>().ReverseMap();

            CreateMap<Domain.Entities.SupplierPaymentType, SupplierPaymentTypeDTO>().ReverseMap();

            CreateMap<Domain.Entities.SupplierPaymentDetail, SupplierPaymentDetailDTO>().ReverseMap();

            CreateMap<Domain.Entities.UserPasswordManagement, UserPasswordManagementDTO>().ReverseMap();

            CreateMap<Domain.Entities.PaymentTerm, PaymentTermDTO>().ReverseMap();

            CreateMap<Domain.Entities.StockEntryAttachment, StockEntryAttachmentDTO>().ReverseMap();

            CreateMap<Domain.Entities.ProductCategoryType, ProductCategoryTypeDTO>().ReverseMap();

            CreateMap<Domain.Entities.ProductAlternative, ProductAlternativeDTO>().ReverseMap();

            CreateMap<Domain.Entities.Enterprise, GetEnterprisesPagedResponse>()
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.EnterpriseAddresses.FirstOrDefault() != null ? $"{src.EnterpriseAddresses.First().Street} - {src.EnterpriseAddresses.First().PostalCode}" : "Sem endereço"))
                .ForMember(dest => dest.Contact, opt => opt.MapFrom(src => src.EnterpriseContacts.FirstOrDefault() != null ? src.EnterpriseContacts.First().EmailAddress : "Sem Contato"))
                .ForMember(dest => dest.LicenseName, opt => opt.MapFrom(src => src.License.Name));

            CreateMap<Domain.Entities.Enterprise, GetEnterpriseByIdResponse>().ReverseMap();

            CreateMap<Domain.Entities.Enterprise, GetAllEnterprisesForUserRegistrationResponse>().ReverseMap();

            CreateMap<Domain.Entities.Users, GetUsersPagedResponse>()
                .ForMember(dest => dest.EnterpriseName, opt => opt.MapFrom(src => src.UserEnterprises.FirstOrDefault().Enterprise.FantasyName))
                .ForMember(dest => dest.LicenseName, opt => opt.MapFrom(src => src.UserEnterprises.FirstOrDefault().LicenseManagement.License.Name))
                .ForMember(dest => dest.AccessProfileName, opt => opt.MapFrom(src => src.AccessProfile.Name)).ReverseMap();

            CreateMap<Domain.Entities.Users, GetUserByIdResponse>()
                .ForMember(dest => dest.EnterpriseName, opt => opt.MapFrom(src => src.UserEnterprises.FirstOrDefault().Enterprise.FantasyName))
                .ForMember(dest => dest.LicenseName, opt => opt.MapFrom(src => src.UserEnterprises.FirstOrDefault().LicenseManagement.License.Name))
                .ForMember(dest => dest.AccessProfileName, opt => opt.MapFrom(src => src.AccessProfile.Name)).ReverseMap();

            CreateMap<Domain.Entities.Enterprise, GetEnterpriseDetailByIdResponse>();

            CreateMap<Domain.Entities.Unit, GetUnitsPagedResponse>();

            CreateMap<Domain.Entities.Unit, GetUnitByIdResponse>();

            CreateMap<Domain.Entities.SubCategory, GetSubCategoriesPagedResponse>();

            CreateMap<Domain.Entities.SubCategory, GetSubCategoryByIdResponse>();

            CreateMap<Domain.Entities.Item, GetItemsPagedResponse>();

            CreateMap<Domain.Entities.Item, GetItemByIdResponse>();

            CreateMap<Domain.Entities.ProductType, GetProductTypesPagedResponse>();

            CreateMap<Domain.Entities.ProductType, GetProductTypeByIdResponse>();

            CreateMap<Domain.Entities.Brand, GetBrandsPagedResponse>();

            CreateMap<Domain.Entities.Brand, GetBrandByIdResponse>();

            CreateMap<Domain.Entities.CategoryType, GetCategoryTypesPagedResponse>();

            CreateMap<Domain.Entities.CategoryType, GetCategoryTypeByIdResponse>();

            CreateMap<Domain.Entities.CategoryType, GetAllCategoryTypesByEnterpriseIdResponse>();

            CreateMap<Domain.Entities.Category, GetCategoriesPagedResponse>()
                .ForMember(dest => dest.CategoryTypeName, opt => opt.MapFrom(src => src.CategoryType.Name));

            CreateMap<Domain.Entities.Category, GetCategoryByIdResponse>();

            CreateMap<Domain.Entities.Supplier, GetSuppliersPagedResponse>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<Domain.Entities.Category, GetAllCategoriesByEnterpriseIdResponse>();

            CreateMap<Domain.Entities.PaymentType, GetAllPaymentTypesByEnterpriseIdResponse>();

            CreateMap<Domain.Entities.SubCategory, GetAllSubCategoriesByEnterpriseIdResponse>();

            CreateMap<Domain.Entities.Supplier, GetSupplierByIdResponse>();

            CreateMap<Domain.Entities.SupplierPaymentDetail, SupplierPaymentDetailResponse>();

            CreateMap<Domain.Entities.SupplierPaymentType, SupplierPaymentTypeResponse>()
                .ForMember(dest => dest.PaymentTypeName, opt => opt.MapFrom(src => src.PaymentType.Name));

            CreateMap<Domain.Entities.Item, GetAllItemsByEnterpriseIdResponse>();

            CreateMap<Domain.Entities.Brand, GetAllBrandsByEnterpriseIdResponse>();

            CreateMap<Domain.Entities.ProductType, GetAllProductTypesByEnterpriseIdResponse>();

            CreateMap<Domain.Entities.Unit, GetAllUnitsByEnterpriseIdResponse>();

            CreateMap<Domain.Entities.Merchandise, GetMerchandisesPagedResponse>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => String.Format("{0} {1} {2}", (src.Item.Name ?? ""), (src.Brand.Name ?? ""), (src.ProductType.Name ?? ""))))
                .ForMember(dest => dest.ItemName, opt => opt.MapFrom(src => src.Item.Name))
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand.Name))
                .ForMember(dest => dest.ProductTypeName, opt => opt.MapFrom(src => src.ProductType.Name))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.UnitName, opt => opt.MapFrom(src => src.Unit.Name));

            CreateMap<Domain.Entities.Merchandise, GetMerchandiseByIdResponse>();

            CreateMap<Domain.Entities.Merchandise, GetAllMerchandisesByEnterpriseIdResponse>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.Brand.Name) ? (string.IsNullOrEmpty(src.ProductType.Name) ? src.Item.Name : $"{src.Item.Name} - {src.ProductType.Name}") : $"{src.Item.Name} - {src.Brand.Name}"))
                .ForMember(dest => dest.ItemName, opt => opt.MapFrom(src => src.Item.Name))
                .ForMember(dest => dest.ProductTypeName, opt => opt.MapFrom(src => src.ProductType.Name))
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand.Name));

            CreateMap<Domain.Entities.ProductIntermediate, GetProductIntermediatesPagedResponse>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.SubCategoryName, opt => opt.MapFrom(src => src.SubCategory.Name));

            CreateMap<Domain.Entities.ProductIntermediate, GetProductIntermediateByIdResponse>();

            CreateMap<Domain.Entities.ProductIntermediateComposition, ProductIntermediateCompositionResponse>();

            CreateMap<Domain.Entities.ProductIntermediate, GetAllProductIntermediatesByEnterpriseIdResponse>();

            CreateMap<Domain.Entities.Product, GetProductsPagedResponse>();

            CreateMap<Domain.Entities.ProductComposition, ProductCompositionResponse>();

            CreateMap<Domain.Entities.Product, GetProductByIdResponse>();

            CreateMap<Domain.Entities.Supplier, GetAllSuppliersByEnterpriseIdResponse>();

            CreateMap<Domain.Entities.PaymentTerm, GetAllPaymentTermsResponse>();

            CreateMap<Domain.Entities.StockEntry, GetStockEntriesPagedResponse>()
                .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier.FantasyName))
                .ForMember(dest => dest.PaymentTypeName, opt => opt.MapFrom(src => src.PaymentType.Name))
                .ForMember(dest => dest.StockEntryAttachmentCount, opt => opt.MapFrom(src => src.StockEntryAttachments.Count));

            CreateMap<Domain.Entities.StockEntry, GetStockEntryByIdResponse>();

            CreateMap<Domain.Entities.StockEntryItem, StockEntryItemResponse>();

            CreateMap<Domain.Entities.Item, CheckItemsExistResponse>();

            CreateMap<Domain.Entities.Unit, CheckUnitsExistResponse>();

            CreateMap<Domain.Entities.Brand, CheckBrandsExistResponse>();

            CreateMap<Domain.Entities.ProductType, CheckProductTypesExistResponse>();

            CreateMap<Domain.Entities.Category, CheckCategoriesExistResponse>();

            CreateMap<Domain.Entities.SubCategory, CheckSubCategoriesExistResponse>();

            CreateMap<Domain.Entities.CategoryType, CheckCategoryTypesExistResponse>();

            CreateMap<Domain.Entities.Supplier, CheckSupplierExistResponse>();

            CreateMap<Domain.Entities.StockEntryAttachment, StockEntryAttachmentResponse>();

            CreateMap<Domain.Entities.Product, GetAllProductsBySearchTermResponse>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.SubCategoryName, opt => opt.MapFrom(src => src.SubCategory.Name));
        }
    }
}
