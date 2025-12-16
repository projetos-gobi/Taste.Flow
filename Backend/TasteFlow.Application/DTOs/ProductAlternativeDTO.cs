using System.Runtime.Serialization;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class ProductAlternativeDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "enterpriseId")]
        public Guid EnterpriseId { get; set; }

        [DataMember(Name = "productOriginalId")]
        public Guid ProductOriginalId { get; set; }

        [DataMember(Name = "productSecondaryId")]
        public Guid ProductSecondaryId { get; set; }

        [DataMember(Name = "costReduction")]
        public decimal? CostReduction { get; set; }

        [DataMember(Name = "marginImprovement")]
        public decimal? MarginImprovement { get; set; }

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
    }
}
