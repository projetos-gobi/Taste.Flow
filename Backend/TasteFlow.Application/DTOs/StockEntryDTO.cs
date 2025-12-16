using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class StockEntryDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "enterpriseId")]
        public Guid EnterpriseId { get; set; }

        [DataMember(Name = "supplierId")]
        public Guid SupplierId { get; set; }

        [DataMember(Name = "paymentTypeId")]
        public Guid PaymentTypeId { get; set; }

        [DataMember(Name = "paymentTermId")]
        public Guid PaymentTermId { get; set; }

        [DataMember(Name = "purchaseDate")]
        public DateTime? PurchaseDate { get; set; }

        [DataMember(Name = "expectedDeliveryDate")]
        public DateTime? ExpectedDeliveryDate { get; set; }

        [DataMember(Name = "receivedBy")]
        public string ReceivedBy { get; set; }

        [DataMember(Name = "isDeliveryCompleted")]
        public bool IsDeliveryCompleted { get; set; }

        [DataMember(Name = "invoiceNumber")]
        public string? InvoiceNumber { get; set; }

        [DataMember(Name = "totalAmount")]
        public decimal TotalAmount { get; set; }

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

        [DataMember(Name = "enterprise")]
        public EnterpriseDTO Enterprise { get; set; }

        [DataMember(Name = "supplier")]
        public SupplierDTO Supplier { get; set; }

        [DataMember(Name = "paymentType")]
        public PaymentTypeDTO PaymentType { get; set; }

        [DataMember(Name = "paymentTerm")]
        public PaymentTermDTO PaymentTerm { get; set; }

        [DataMember(Name = "stockEntryItems")]
        public List<StockEntryItemDTO> StockEntryItems { get; set; }

        [DataMember(Name = "stockEntryAttachments")]
        public List<StockEntryAttachmentDTO> StockEntryAttachments { get; set; }
    }
}
