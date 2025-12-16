using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Domain.Interfaces.Common
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(Guid enterpriseId, string fileName, Stream fileStream, string contentType, CancellationToken cancellationToken = default);
        Task<Stream?> DownloadFileAsync(string fileName, CancellationToken cancellationToken = default);
        Task<bool> DeleteFileAsync(string fileName, CancellationToken cancellationToken = default);
        Task<string> GeneratePreSignedUrlAsync(string fileUrlOrKey, int expiresInMinutes = 15);
    }
}
