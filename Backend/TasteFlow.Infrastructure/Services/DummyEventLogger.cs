using System;
using TasteFlow.Domain.Enums;
using TasteFlow.Domain.Interfaces.Common;

namespace TasteFlow.Infrastructure.Services
{
    public class DummyEventLogger : IEventLogger
    {
        public Guid Log(LogTypeEnum logType, Exception exception, string message)
        {
            // Implementação vazia - apenas log no console
            Console.WriteLine($"[DummyLogger] {logType}: {message} - {exception?.Message}");
            return Guid.NewGuid();
        }

        public Guid Log(LogTypeEnum logType, string message)
        {
            // Implementação vazia - apenas log no console
            Console.WriteLine($"[DummyLogger] {logType}: {message}");
            return Guid.NewGuid();
        }
    }
}

