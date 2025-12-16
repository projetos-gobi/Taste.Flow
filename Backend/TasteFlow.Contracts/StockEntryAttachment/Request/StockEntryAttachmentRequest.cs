using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.StockEntryAttachment.Request
{
    public record StockEntryAttachmentRequest
    {
        public Guid? Id { get; set; }
        public string FileName { get; init; }
        public string FileExtension { get; init; }
        public long FileSize { get; init; }
        public byte[]? File { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
