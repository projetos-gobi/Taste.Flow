using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.DTOs
{
    [DataContract]
    public class StockEntryAttachmentDTO
    {
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        [DataMember(Name = "enterpriseId")]
        public Guid EnterpriseId { get; set; }

        [DataMember(Name = "stockEntryId")]
        public Guid StockEntryId { get; set; }

        [DataMember(Name = "fileName")]
        public string? FileName { get; set; }

        [DataMember(Name = "filePath")]
        public string? FilePath { get; set; }

        [DataMember(Name = "fileExtension")]
        public string? FileExtension { get; set; }

        [DataMember(Name = "fileSize")]
        public long? FileSize { get; set; }

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

        [DataMember(Name = "stockEntry")]
        public StockEntryDTO StockEntry { get; set; }

        [NotMapped]
        [DataMember(Name = "file")]
        public byte[] File { get; set; }
    }
}
