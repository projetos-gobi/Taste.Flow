using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using TasteFlow.Domain.Entities;
using TasteFlow.Domain.Interfaces.Common;

namespace TasteFlow.Infrastructure.Services
{
    public class S3FileStorageService : IFileStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public S3FileStorageService(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"] ?? throw new ArgumentNullException("BucketName not configured");
        }

        public async Task<bool> DeleteFileAsync(string fileName, CancellationToken cancellationToken = default)
        {
            try
            {
                var request = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = fileName
                };

                var response = await _s3Client.DeleteObjectAsync(request, cancellationToken);
                return response.HttpStatusCode == System.Net.HttpStatusCode.NoContent;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<Stream?> DownloadFileAsync(string fileName, CancellationToken cancellationToken = default)
        {
            try
            {
                var request = new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = fileName
                };

                using var response = await _s3Client.GetObjectAsync(request, cancellationToken);
                var memoryStream = new MemoryStream();
                await response.ResponseStream.CopyToAsync(memoryStream, cancellationToken);
                memoryStream.Position = 0;

                return memoryStream;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<string> GeneratePreSignedUrlAsync(string fileUrlOrKey, int expiresInMinutes = 15)
        {
            try
            {
                string fileKey = "";
                if (Uri.TryCreate(fileUrlOrKey, UriKind.Absolute, out var uri))
                {
                    fileKey = uri.AbsolutePath.TrimStart('/');
                }
                else
                {
                    fileKey = fileUrlOrKey;
                }

                var lastSegment = fileKey.Substring(fileKey.LastIndexOf("/") + 1);

                var fileName = lastSegment.Contains("_") ? lastSegment.Substring(lastSegment.LastIndexOf("_") + 1) : lastSegment;

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = fileKey,
                    Expires = DateTime.UtcNow.AddMinutes(expiresInMinutes),
                    Verb = HttpVerb.GET,
                    ResponseHeaderOverrides = new ResponseHeaderOverrides
                    {
                        ContentDisposition = $"attachment; filename=\"{fileName}\""
                    }
                };

                return _s3Client.GetPreSignedURL(request);
            }
            catch
            {
                return string.Empty;
            }
        }

        public async Task<string> UploadFileAsync(Guid enterpriseId, string fileName, Stream fileStream, string contentType, CancellationToken cancellationToken = default)
        {
            try
            {
                var key = $"enterprises/{enterpriseId}/{Guid.NewGuid()}_{fileName}";

                var request = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    InputStream = fileStream,
                    ContentType = contentType
                };

                await _s3Client.PutObjectAsync(request, cancellationToken);

                return $"https://{_bucketName}.s3.amazonaws.com/{key}";
            }
            catch (Exception ex)
            {

                return String.Empty;
            }
        }
    }
}
