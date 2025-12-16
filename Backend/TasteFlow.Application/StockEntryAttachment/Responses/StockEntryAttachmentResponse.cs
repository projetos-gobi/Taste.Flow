using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.StockEntryAttachment.Responses
{
    public record StockEntryAttachmentResponse
    {
        public Guid Id { get; init; }
        public Guid StockEntryId { get; init; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileExtension { get; set; }
    }
}
