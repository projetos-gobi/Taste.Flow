using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class MerchandiseDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "enterpriseId")]
        public Guid EnterpriseId { get; set; }

        [DataMember(Name = "itemId")]
        public Guid ItemId { get; set; }

        [DataMember(Name = "brandId")]
        public Guid? BrandId { get; set; }

        [DataMember(Name = "productTypeId")]
        public Guid? ProductTypeId { get; set; }

        [DataMember(Name = "categoryId")]
        public Guid CategoryId { get; set; }

        [DataMember(Name = "unitId")]
        public Guid UnitId { get; set; }

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

        [DataMember(Name = "brand")]
        public BrandDTO Brand { get; set; }

        [DataMember(Name = "category")]
        public CategoryDTO Category { get; set; }

        [DataMember(Name = "createdByNavigation")]
        public UsersDTO CreatedByNavigation { get; set; }

        [DataMember(Name = "deletedByNavigation")]
        public UsersDTO? DeletedByNavigation { get; set; }

        [DataMember(Name = "enterprise")]
        public EnterpriseDTO Enterprise { get; set; }

        [DataMember(Name = "item")]
        public ItemDTO Item { get; set; }

        [DataMember(Name = "modifiedByNavigation")]
        public UsersDTO? ModifiedByNavigation { get; set; }

        [DataMember(Name = "productCompositions")]
        public List<ProductCompositionDTO> ProductCompositions { get; set; }

        [DataMember(Name = "productIntermediateCompositions")]
        public List<ProductIntermediateCompositionDTO> ProductIntermediateCompositions { get; set; }

        [DataMember(Name = "productType")]
        public ProductTypeDTO? ProductType { get; set; }

        [DataMember(Name = "unit")]
        public UnitDTO Unit { get; set; }
    }
}
