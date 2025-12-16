using AutoMapper;
using TasteFlow.Application.Authentication.Commands;
using TasteFlow.Application.Authentication.Queries;
using TasteFlow.Application.Authentication.Responses;
using TasteFlow.Application.Brand.Commands;
using TasteFlow.Application.Brand.Queries;
using TasteFlow.Application.Category.Commands;
using TasteFlow.Application.Category.Queries;
using TasteFlow.Application.CategoryType.Commands;
using TasteFlow.Application.CategoryType.Queries;
using TasteFlow.Application.DTOs;
using TasteFlow.Application.Enterprise.Commands;
using TasteFlow.Application.Enterprise.Queries;
using TasteFlow.Application.Item.Commands;
using TasteFlow.Application.Item.Queries;
using TasteFlow.Application.Merchandise.Commands;
using TasteFlow.Application.Merchandise.Queries;
using TasteFlow.Application.PaymentType.Queries;
using TasteFlow.Application.Product.Commands;
using TasteFlow.Application.Product.Queries;
using TasteFlow.Application.ProductIntermediate.Commands;
using TasteFlow.Application.ProductIntermediate.Queries;
using TasteFlow.Application.ProductType.Commands;
using TasteFlow.Application.ProductType.Queries;
using TasteFlow.Application.StockEntry.Commands;
using TasteFlow.Application.StockEntry.Queries;
using TasteFlow.Application.StockEntryAttachment.Queries;
using TasteFlow.Application.SubCategory.Commands;
using TasteFlow.Application.SubCategory.Queries;
using TasteFlow.Application.Supplier.Commands;
using TasteFlow.Application.Supplier.Queries;
using TasteFlow.Application.Unit.Commands;
using TasteFlow.Application.Unit.Queries;
using TasteFlow.Application.Users.Commands;
using TasteFlow.Application.Users.Queries;
using TasteFlow.Contracts.Authentication.Request;
using TasteFlow.Contracts.Authentication.Response;
using TasteFlow.Contracts.Brand.Request;
using TasteFlow.Contracts.Category.Request;
using TasteFlow.Contracts.CategoryType.Request;
using TasteFlow.Contracts.Enterprise.Request;
using TasteFlow.Contracts.EnterpriseAddress.Request;
using TasteFlow.Contracts.EnterpriseContact.Request;
using TasteFlow.Contracts.Item.Request;
using TasteFlow.Contracts.Merchandise.Request;
using TasteFlow.Contracts.PaymentType.Request;
using TasteFlow.Contracts.Product.Request;
using TasteFlow.Contracts.ProductComposition.Request;
using TasteFlow.Contracts.ProductIntermediate.Request;
using TasteFlow.Contracts.ProductIntermediateComposition.Request;
using TasteFlow.Contracts.ProductType.Request;
using TasteFlow.Contracts.StockEntry.Request;
using TasteFlow.Contracts.StockEntryAttachment.Request;
using TasteFlow.Contracts.StockEntryItem.Request;
using TasteFlow.Contracts.SubCategory.Request;
using TasteFlow.Contracts.Supplier.Request;
using TasteFlow.Contracts.Unit.Request;
using TasteFlow.Contracts.Users.Request;
using TasteFlow.Domain.ValueObjects;

namespace TasteFlow.Api.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<LoginRequest, AuthenticationQuery>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => new Email(src.Email)))
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => new Password(src.Password)));

            CreateMap<AuthenticationResult, AuthenticationResponse>().ReverseMap();

            CreateMap<ForgotPasswordRequest, ForgotPasswordCommand>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => new Email(src.Email))).ReverseMap();

            CreateMap<RecoverPasswordRequest, RecoverPasswordCommand>().ReverseMap();

            CreateMap<ValidatePasswordRecoveryExpirationRequest, ValidatePasswordResetTokenQuery>().ReverseMap();

            CreateMap<CreateEnterpriseRequest, EnterpriseDTO>().ReverseMap();

            CreateMap<CreateEnterpriseRequest, CreateEnterpriseCommand>()
                .ForMember(dest => dest.Enterprise, opt => opt.MapFrom(src => src)).ReverseMap();

            CreateMap<EnterpriseAddressRequest, EnterpriseAddressDTO>().ReverseMap();

            CreateMap<EnterpriseContactRequest, EnterpriseContactDTO>().ReverseMap();

            CreateMap<GetEnterprisesPagedRequest, GetEnterprisesPagedQuery>().ReverseMap();

            CreateMap<GetEnterpriseByIdRequest, GetEnterpriseByIdQuery>().ReverseMap();

            CreateMap<UpdateEnterpriseRequest, EnterpriseDTO>();

            CreateMap<UpdateEnterpriseRequest, UpdateEnterpriseCommand>()
                .ForMember(dest => dest.Enterprise, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteEnterpriseRequest, SoftDeleteEnterpriseCommand>();

            CreateMap<UserRequest, UsersDTO>();

            CreateMap<CreateUsersRangeRequest, CreateUsersRangeCommand>();

            CreateMap<GetUsersPagedRequest, GetUsersPagedQuery>();

            CreateMap<GetUserByIdRequest, GetUserByIdQuery>();

            CreateMap<SoftDeleteUserRequest, SoftDeleteUserCommand>();

            CreateMap<UpdateUserRequest, UsersDTO>();

            CreateMap<UpdateUserRequest, UpdateUserCommand>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src));

            CreateMap<UnitRequest, UnitDTO>();

            CreateMap<CreateUnitsRangeRequest, CreateUnitsRangeCommand>();

            CreateMap<GetUnitsPagedRequest, GetUnitsPagedQuery>();

            CreateMap<GetUnitByIdRequest, GetUnitByIdQuery>();

            CreateMap<UpdateUnitRequest, UnitDTO>();

            CreateMap<UpdateUnitRequest, UpdateUnitCommand>()
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteUnitRequest, SoftDeleteUnitCommand>();

            CreateMap<SubCategoryRequest, SubCategoryDTO>();

            CreateMap<CreateSubCategoriesRangeRequest, CreateSubCategoriesRangeCommand>();

            CreateMap<GetSubCategoriesPagedRequest, GetSubCategoriesPagedQuery>();

            CreateMap<GetSubCategoryByIdRequest, GetSubCategoryByIdQuery>();

            CreateMap<UpdateSubCategoryRequest, SubCategoryDTO>();

            CreateMap<UpdateSubCategoryRequest, UpdateSubCategoryCommand>()
                .ForMember(dest => dest.SubCategory, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteSubCategoryRequest, SoftDeleteSubCategoryCommand>();

            CreateMap<ItemRequest, ItemDTO>();

            CreateMap<CreateItemsRangeRequest, CreateItemsRangeCommand>();

            CreateMap<GetItemsPagedRequest, GetItemsPagedQuery>();

            CreateMap<GetItemByIdRequest, GetItemByIdQuery>();

            CreateMap<UpdateItemRequest, ItemDTO>();

            CreateMap<UpdateItemRequest, UpdateItemCommand>()
                .ForMember(dest => dest.Item, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteItemRequest, SoftDeleteItemCommand>();

            CreateMap<BrandRequest, BrandDTO>();

            CreateMap<CreateBrandsRangeRequest, CreateBrandsRangeCommand>();

            CreateMap<GetBrandsPagedRequest, GetBrandsPagedQuery>();

            CreateMap<GetBrandByIdRequest, GetBrandByIdQuery>();

            CreateMap<UpdateBrandRequest, BrandDTO>();

            CreateMap<UpdateBrandRequest, UpdateBrandCommand>()
                .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteBrandRequest, SoftDeleteBrandCommand>();

            CreateMap<ProductTypeRequest, ProductTypeDTO>();

            CreateMap<CreateProductTypesRangeRequest, CreateProductTypesRangeCommand>();

            CreateMap<GetProductTypesPagedRequest, GetProductTypesPagedQuery>();

            CreateMap<GetProductTypeByIdRequest, GetProductTypeByIdQuery>();

            CreateMap<UpdateProductTypeRequest, ProductTypeDTO>();

            CreateMap<UpdateProductTypeRequest, UpdateProductTypeCommand>()
                .ForMember(dest => dest.ProductType, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteProductTypeRequest, SoftDeleteProductTypeCommand>();

            CreateMap<CategoryTypeRequest, CategoryTypeDTO>();

            CreateMap<CreateCategoryTypesRangeRequest, CreateCategoryTypesRangeCommand>();

            CreateMap<GetCategoryTypesPagedRequest, GetCategoryTypesPagedQuery>();

            CreateMap<GetCategoryTypeByIdRequest, GetCategoryTypeByIdQuery>();

            CreateMap<UpdateCategoryTypeRequest, CategoryTypeDTO>();

            CreateMap<UpdateCategoryTypeRequest, UpdateCategoryTypeCommand>()
                .ForMember(dest => dest.CategoryType, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteCategoryTypeRequest, SoftDeleteCategoryTypeCommand>();

            CreateMap<CategoryRequest, CategoryDTO>();

            CreateMap<CreateCategoriesRangeRequest, CreateCategoriesRangeCommand>();

            CreateMap<GetCategoriesPagedRequest, GetCategoriesPagedQuery>();

            CreateMap<GetCategoryByIdRequest, GetCategoryByIdQuery>();

            CreateMap<UpdateCategoryRequest, CategoryDTO>();

            CreateMap<UpdateCategoryRequest, UpdateCategoryCommand>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteCategoryRequest, SoftDeleteCategoryCommand>();

            CreateMap<GetAllCategoryTypesByEnterpriseIdRequest, GetAllCategoryTypesByEnterpriseIdQuery>();

            CreateMap<CreateSupplierRequest, SupplierDTO>();

            CreateMap<SupplierPaymentDetailRequest, SupplierPaymentDetailDTO>();

            CreateMap<SupplierPaymentTypeRequest, SupplierPaymentTypeDTO>();

            CreateMap<CreateSupplierRequest, CreateSupplierCommand>()
                .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src));

            CreateMap<GetAllCategoriesByEnterpriseIdRequest, GetAllCategoriesByEnterpriseIdQuery>();

            CreateMap<GetSuppliersPagedRequest, GetSuppliersPagedQuery>();

            CreateMap<SoftDeleteSupplierRequest, SoftDeleteSupplierCommand>();

            CreateMap<GetAllPaymentTypesByEnterpriseIdRequest, GetAllPaymentTypesByEnterpriseIdQuery>();

            CreateMap<GetAllSubCategoriesByEnterpriseIdRequest, GetAllSubCategoriesByEnterpriseIdQuery>();

            CreateMap<GetSupplierByIdRequest, GetSupplierByIdQuery>();

            CreateMap<UpdateSupplierRequest, SupplierDTO>();

            CreateMap<UpdateSupplierRequest, UpdateSupplierCommand>()
                .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src));

            CreateMap<MerchandiseRequest, MerchandiseDTO>();

            CreateMap<CreateMerchandisesRangeRequest, CreateMerchandisesRangeCommand>();

            CreateMap<GetMerchandisesPagedRequest, GetMerchandisesPagedQuery>();

            CreateMap<UpdateMerchandiseRequest, MerchandiseDTO>();

            CreateMap<UpdateMerchandiseRequest, UpdateMerchandiseCommand>()
                .ForMember(dest => dest.Merchandise, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteMerchandiseRequest, SoftDeleteMerchandiseCommand>();

            CreateMap<GetAllItemsByEnterpriseIdRequest, GetAllItemsByEnterpriseIdQuery>();

            CreateMap<GetAllBrandsByEnterpriseIdRequest, GetAllBrandsByEnterpriseIdQuery>();

            CreateMap<GetAllProductTypesByEnterpriseIdRequest, GetAllProductTypesByEnterpriseIdQuery>();

            CreateMap<GetAllUnitsByEnterpriseIdRequest, GetAllUnitsByEnterpriseIdQuery>();

            CreateMap<GetMerchandiseByIdRequest, GetMerchandiseByIdQuery>();

            CreateMap<GetAllMerchandisesByEnterpriseIdRequest, GetAllMerchandisesByEnterpriseIdQuery>();

            CreateMap<ProductIntermediateCompositionRequest, ProductIntermediateCompositionDTO>();

            CreateMap<CreateProductIntermediateRequest, ProductIntermediateDTO>();

            CreateMap<CreateProductIntermediateRequest, CreateProductIntermediateCommand>()
                .ForMember(dest => dest.ProductIntermediate, opt => opt.MapFrom(src => src));

            CreateMap<GetProductIntermediatesPagedRequest, GetProductIntermediatesPagedQuery>();

            CreateMap<GetProductIntermediateByIdRequest, GetProductIntermediateByIdQuery>();

            CreateMap<UpdateProductIntermediateRequest, ProductIntermediateDTO>();

            CreateMap<UpdateProductIntermediateRequest, UpdateProductIntermediateCommand>()
                .ForMember(dest => dest.ProductIntermediate, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteProductIntermediateRequest, SoftDeleteProductIntermediateCommand>();

            CreateMap<CreateProductRequest, ProductDTO>();

            CreateMap<ProductCompositionRequest, ProductCompositionDTO>();

            CreateMap<CreateProductRequest, CreateProductCommand>()
               .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src));

            CreateMap<GetProductsPagedRequest, GetProductsPagedQuery>();

            CreateMap<GetProductByIdRequest, GetProductByIdQuery>();

            CreateMap<UpdateProductRequest, ProductDTO>();

            CreateMap<UpdateProductRequest, UpdateProductCommand>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteProductRequest, SoftDeleteProductIntermediateCommand>();

            CreateMap<GetAllProductIntermediatesByEnterpriseIdRequest, GetAllProductIntermediatesByEnterpriseIdQuery>();

            CreateMap<SoftDeleteProductRequest, SoftDeleteProductCommand>();

            CreateMap<GetStockEntriesPagedRequest, GetStockEntriesPagedQuery>();

            CreateMap<GetAllSuppliersByEnterpriseIdRequest, GetAllSuppliersByEnterpriseIdQuery>();

            CreateMap<CreateStockEntryRequest, StockEntryDTO>();

            CreateMap<StockEntryItemRequest, StockEntryItemDTO>();

            CreateMap<StockEntryAttachmentRequest, StockEntryAttachmentDTO>();

            CreateMap<CreateStockEntryRequest, CreateStockEntryCommand>()
                .ForMember(dest => dest.StockEntry, opt => opt.MapFrom(src => src));

            CreateMap<GetStockEntriesPagedRequest, GetStockEntriesPagedQuery>();

            CreateMap<GetStockEntryByIdRequest, GetStockEntryByIdQuery>();

            CreateMap<UpdateStockEntryRequest, StockEntryDTO>();

            CreateMap<UpdateStockEntryRequest, UpdateStockEntryCommand>()
                .ForMember(dest => dest.StockEntry, opt => opt.MapFrom(src => src));

            CreateMap<SoftDeleteStockEntryRequest, SoftDeleteStockEntryCommand>();

            CreateMap<RefreshTokenRequest, RefreshTokenQuery>();

            CreateMap<CheckItemsExistRequest, CheckItemsExistQuery>();

            CreateMap<CheckUnitsExistRequest, CheckUnitsExistQuery>();

            CreateMap<CheckBrandsExistRequest, CheckBrandsExistQuery>();

            CreateMap<CheckProductTypesExistRequest, CheckProductTypesExistQuery>();

            CreateMap<CheckCategoriesExistRequest, CheckCategoriesExistQuery>();

            CreateMap<CheckSubCategoriesExistRequest, CheckSubCategoriesExistQuery>();

            CreateMap<CheckCategoryTypesExistRequest, CheckCategoryTypesExistQuery>();

            CreateMap<CheckSupplierExistRequest, CheckSupplierExistQuery>();

            CreateMap<GetFileUrlStockEntryAttachmentRequest, GetFileUrlStockEntryAttachmentQuery>();

            CreateMap<GetAllProductsBySearchTermRequest, GetAllProductsBySearchTermQuery>();
        }
    }
}
