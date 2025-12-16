using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TasteFlow.Contracts.Common
{
    public sealed class DetailedError
    {
        [JsonPropertyName("code")]
        public string Code { get; init; } = string.Empty;

        [JsonPropertyName("data")]
        public object? Data { get; init; }
    }
}
