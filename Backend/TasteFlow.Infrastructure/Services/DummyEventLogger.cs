using System;
using TasteFlow.Domain.Interfaces.Common;

namespace TasteFlow.Infrastructure.Services
{
    public class DummyEventLogger : IEventLogger
    {
        public void Log(object logType, Exception exception, string message)
        {
            // Implementação vazia - não faz nada
            Console.WriteLine($"[DummyLogger] {message}");
        }
    }
}

