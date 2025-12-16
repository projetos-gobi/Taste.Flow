using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Application.Common
{
    public sealed class Result<T>
    {
        public bool IsSuccess { get; }
        public string Message { get; }
        public T? Data { get; }

        private Result(bool isSuccess, string message, T? data)
        {
            IsSuccess = isSuccess;
            Message = message;
            Data = data;
        }

        public static Result<T> Success(T data, string message = "") => new Result<T>(true, message, data);

        public static Result<T> Failure(string message) => new Result<T>(false, message, default);
    }
}
