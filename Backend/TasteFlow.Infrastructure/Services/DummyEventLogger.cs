using System;
using TasteFlow.Domain.Enums;
using TasteFlow.Domain.Interfaces.Common;

namespace TasteFlow.Infrastructure.Services
{
    public class DummyEventLogger : IEventLogger
    {
        public Guid Log(LogTypeEnum logType, Exception exception, string message)
        {
            // Implementação propositalmente vazia (evita impacto de I/O em stdout).
            return Guid.NewGuid();
        }

        public Guid Log(LogTypeEnum logType, string message)
        {
            // Implementação propositalmente vazia (evita impacto de I/O em stdout).
            return Guid.NewGuid();
        }
    }
}

