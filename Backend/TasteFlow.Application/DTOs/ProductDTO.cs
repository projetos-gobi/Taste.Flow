using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class ProductDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "enterpriseId")]
        public Guid EnterpriseId { get; set; }

        [DataMember(Name = "productCategoryTypeId")]
        public Guid ProductCategoryTypeId { get; set; }

        [DataMember(Name = "categoryId")]
        public Guid CategoryId { get; set; }

        [DataMember(Name = "subCategoryId")]
        public Guid SubCategoryId { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "instruction")]
        public string Instruction { get; set; }

        [DataMember(Name = "price")]
        public decimal? Price { get; set; }

        [DataMember(Name = "yield")]
        public int Yield { get; set; }

        [DataMember(Name = "multiplier")]
        public decimal Multiplier { get; set; }

        [DataMember(Name = "marginValue")]
        public decimal MarginValue { get; set; }

        [DataMember(Name = "marginPercent")]
        public decimal MarginPercent { get; set; }

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

        [DataMember(Name = "createdByNavigation")]
        public UsersDTO CreatedByNavigation { get; set; }

        [DataMember(Name = "deletedByNavigation")]
        public UsersDTO? DeletedByNavigation { get; set; }

        [DataMember(Name = "enterprise")]
        public EnterpriseDTO Enterprise { get; set; }

        [DataMember(Name = "modifiedByNavigation")]
        public UsersDTO? ModifiedByNavigation { get; set; }

        [DataMember(Name = "productCompositions")]
        public List<ProductCompositionDTO> ProductCompositions { get; set; }

        [DataMember(Name = "subCategory")]
        public SubCategoryDTO SubCategory { get; set; }
    }
}
