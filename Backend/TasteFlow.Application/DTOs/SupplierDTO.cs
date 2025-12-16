using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class SupplierDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "enterpriseId")]
        public Guid EnterpriseId { get; set; }

        [DataMember(Name = "categoryId")]
        public Guid CategoryId { get; set; }

        [DataMember(Name = "subCategoryId")]
        public Guid SubCategoryId { get; set; }

        [DataMember(Name = "fantasyName")]
        public string? FantasyName { get; set; }

        [DataMember(Name = "socialReason")]
        public string? SocialReason { get; set; }

        [DataMember(Name = "cnpj")]
        public string? Cnpj { get; set; }

        [DataMember(Name = "telephone")]
        public string? Telephone { get; set; }

        [DataMember(Name = "address")]
        public string? Address { get; set; }

        [DataMember(Name = "latitude")]
        public double? Latitude { get; set; }

        [DataMember(Name = "longitude")]
        public double? Longitude { get; set; }

        [DataMember(Name = "createdOn")]
        public DateTime CreatedOn { get; set; }

        [DataMember(Name = "modifiedOn")]
        public DateTime? ModifiedOn { get; set; }

        [DataMember(Name = "deletedOn")]
        public DateTime? DeletedOn { get; set; }

        [DataMember(Name = "createdBy")]
        public Guid CreatedBy { get; set; }

        [DataMember(Name = "modifiedBy")]
        public Guid? ModifiedBy { get; set; }

        [DataMember(Name = "deletedBy")]
        public Guid? DeletedBy { get; set; }

        [DataMember(Name = "isDeleted")]
        public bool IsDeleted { get; set; }

        [DataMember(Name = "isActive")]
        public bool IsActive { get; set; }

        [DataMember(Name = "category")]
        public CategoryDTO Category { get; set; }

        [DataMember(Name = "enterprise")]
        public EnterpriseDTO Enterprise { get; set; }

        [DataMember(Name = "paymentType")]
        public PaymentTypeDTO PaymentType { get; set; }

        [DataMember(Name = "stockEntries")]
        public List<StockEntryDTO> StockEntries { get; set; }

        [DataMember(Name = "subCategory")]
        public SubCategoryDTO SubCategory { get; set; }

        [DataMember(Name = "supplierPaymentDetail")]
        public SupplierPaymentDetailDTO SupplierPaymentDetail { get; set; }

        [DataMember(Name = "supplierPaymentTypes")]
        public IEnumerable<SupplierPaymentTypeDTO> SupplierPaymentTypes { get; set; }
    }
}
